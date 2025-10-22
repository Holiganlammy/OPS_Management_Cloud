// lib/axios/interceptors.ts
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";
import { Toast } from "../alert/toast";
import { showTokenExpiredAlert, cleanupGlobalAlert } from "../alert/globalAlertService";

const http = process.env.NEXT_PUBLIC_API_URL;

let isTokenExpired = false;
let isSigningOut = false;
let lastSignOutTime = 0;
let isTokenExpiredAlertShowing = false;

// Request deduplication
const pendingRequests = new Map<string, boolean>();

// Session cache
let sessionCache: any = null;
let sessionCacheTime = 0;
const CACHE_DURATION = 3000; // 3 วินาที

export const error401 = async () => {
  const now = Date.now();
  
  // ป้องกัน multiple signOut calls
  if (isSigningOut || (now - lastSignOutTime) < 3000) {
    console.log("⏭️ SignOut already in progress");
    return;
  }

  isSigningOut = true;
  isTokenExpired = true;
  isTokenExpiredAlertShowing = true;
  lastSignOutTime = now;
  
  // Clear caches
  sessionCache = null;
  sessionCacheTime = 0;
  pendingRequests.clear();

  console.log("🚪 Token expired - showing alert...");
  
  // แสดง Alert Dialog แทน Toast
  showTokenExpiredAlert(async () => {
    try {
      await signOut({ redirect: false });
    } catch (err) {
      console.error("SignOut error:", err);
      // Force redirect แม้เกิด error
      window.location.replace('/login');
    } finally {
      setTimeout(() => {
        isSigningOut = false;
        isTokenExpiredAlertShowing = false;
      }, 2000);
    }
  });
}

export const error403 = () => {
  window.location.href = '/home';
}

export const resetAxiosState = () => {
  isTokenExpired = false;
  isSigningOut = false;
  lastSignOutTime = 0;
  isTokenExpiredAlertShowing = false;
  sessionCache = null;
  sessionCacheTime = 0;
  pendingRequests.clear();
  cleanupGlobalAlert();
  
  console.log("✅ Axios state reset - ready for new session");
}

export const isTokenExpiredAlertVisible = () => isTokenExpiredAlertShowing;

function handleError(err: any) {
  if (axios.isAxiosError(err)) {
    const response = err.response;
    const status = response?.status;
    const errorData = response?.data;

    if (status === 400) {
      Toast.fire({
        icon: "error",
        title: errorData?.message || "Bad Request",
        text: errorData?.error ? `${errorData.error.code}: ${errorData.error.path?.[0]}` : "Invalid request"
      });
    }
    else if (status === 401) {
      console.log("🔍 401 Error Data:", errorData);

      // Case 1: Login credentials ผิด
      if (errorData?.credentials === false) {
        console.log("❌ Invalid credentials - handled by login component");
        // ไม่ทำอะไร ให้ Login component จัดการเอง
        return;
      }

      // Case 2: Token หมดอายุ
      if (errorData?.tokenExpired === true) {
        console.log("⏰ Token expired - redirecting to login");
        error401();
        return;
      }

      // Case 3: Token ไม่ถูกต้อง (signature ผิด, format ผิด)
      if (errorData?.tokenInvalid === true) {
        console.log("🔐 Invalid token - redirecting to login");
        error401();
        return;
      }

      // Case 4: ไม่มี Token
      if (errorData?.noToken === true) {
        console.log("📭 No token provided - redirecting to login");
        error401();
        return;
      }

      // Case 5: Token ยังไม่ active (NotBeforeError)
      if (errorData?.tokenNotActive === true) {
        console.log("⏳ Token not active yet - redirecting to login");
        error401();
        return;
      }

      // Fallback: ถ้าไม่ตรงกับ case ไหนเลย ให้ถือว่า token หมดอายุ
      console.log("⚠️ Unknown 401 error - treating as token expired");
      error401();
    }
    else if (status === 403) {
      error403();
    }
    else if (status === 409 && errorData?.duplicate === true) {
      // Silent - duplicate entry
      return;
    }
    else if (status === 500) {
      Toast.fire({
        icon: "error",
        title: "Server Error",
        text: "Please try again later."
      });
    }
    else if (status) {
      Toast.fire({
        icon: "error", 
        title: `Error ${status}`,
        text: errorData?.message || "An error occurred"
      });
    }
    else {
      Toast.fire({
        icon: "error",
        title: "Network Error",
        text: "Check your connection and try again."
      });
    }
  } else {
    console.error("Unexpected error:", err);
  }
}

const baseConfig: AxiosRequestConfig = {
  baseURL: http,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
};

const getCachedSession = async () => {
  const now = Date.now();
  
  if (sessionCache && (now - sessionCacheTime) < CACHE_DURATION) {
    return sessionCache;
  }
  
  const session = await getSession();
  sessionCache = session;
  sessionCacheTime = now;
  
  return session;
}

const baseRequest = async (config: InternalAxiosRequestConfig) => {
  const url = config.url || '';
  const method = config.method?.toUpperCase() || 'GET';
  
  // Skip deduplication สำหรับ NextAuth internal calls
  if (url.includes('/api/auth/')) {
    const session = await getCachedSession();
    if (config.headers && session?.user?.access_token) {
      config.headers.Authorization = `Bearer ${session.user.access_token}`;
    }
    return config;
  }

  // Request deduplication key
  const requestKey = `${method}:${url}`;
  
  // if (pendingRequests.has(requestKey)) {
  //   console.log(`⏭️ Duplicate request cancelled: ${requestKey}`);
  //   const controller = new AbortController();
  //   controller.abort("DUPLICATE_REQUEST");
  //   config.signal = controller.signal;
  //   return config;
  // }

  // Mark as pending
  pendingRequests.set(requestKey, true);
  
  // Auto-cleanup หลัง 30 วินาที
  setTimeout(() => {
    pendingRequests.delete(requestKey);
  }, 30000);

  // Get session and attach token
  const session = await getCachedSession();
  
  if (config.headers && session?.user?.access_token) {
    config.headers.Authorization = `Bearer ${session.user.access_token}`;
  }

  return config;
}

const baseResponse = (response: AxiosResponse) => {
  const requestKey = `${response.config.method?.toUpperCase()}:${response.config.url}`;
  pendingRequests.delete(requestKey);
  
  return response;
}

const responseError = (error: any) => {
  if (error.config) {
    const requestKey = `${error.config.method?.toUpperCase()}:${error.config.url}`;
    pendingRequests.delete(requestKey);
  }

  handleError(error);
  return Promise.reject(error);
}

// Create axios instance
const client = axios.create(baseConfig);

// Apply interceptors
client.interceptors.request.use(baseRequest, (error) => {
  handleError(error);
  return Promise.reject(error);
});

client.interceptors.response.use(baseResponse, responseError);

export default client;