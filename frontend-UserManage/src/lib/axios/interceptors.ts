import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";
import { Toast } from "../alert/toast";

const http = process.env.NEXT_PUBLIC_API_URL;

// ✅ เพิ่ม session cache เพื่อลด getSession() calls
let sessionCache: any = null;
let sessionCacheTime = 0;
const CACHE_DURATION = 5000; // 5 วินาที

export const error401 = () => {
  sessionCache = null; 
  signOut({ redirect: false });
}

export const error403 = () => {
  window.location.href = 'https://localhost:3000/home';
}

function handleError(err: any) {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 400) {
      const errorData = err.response.data;
      const message = errorData?.message || "Bad Request";
      let errorText = "Something went wrong.";
      if (errorData?.error) {
        const code = errorData.error.code || "ERROR";
        const path = errorData.error.path?.[0] || "unknown_field";
        errorText = `${code} : ${path}`;
      }

      Toast.fire({
        icon: "error",
        title: message,
        text: errorText
      });
    }
    else if (err.response?.status === 409 && err.response?.data?.duplicate === true) {
      return;
    }
    else if (err.response?.status === 401) {
      error401();
    }
    else if (err.response?.status === 500) {
      Toast.fire({
        icon: "error",
        title: "Server Error",
        text: "Internal server error occurred. Please try again later."
      });
    }
    else if (err.response?.status) {
      Toast.fire({
        icon: "error", 
        title: `Error ${err.response.status}`,
        text: err.response.data?.message || "An error occurred"
      });
    }
    else {
      Toast.fire({
        icon: "error",
        title: "Network Error",
        text: "Please check your internet connection and try again."
      });
    }
  } else {
    console.error("Non-axios error:", err);
    Toast.fire({
      icon: "error",
      title: "Unexpected Error", 
      text: "Something went wrong. Please try again."
    });
  }
}

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const baseConfig: AxiosRequestConfig = {
  baseURL: http,
  cancelToken: source.token,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
};

// ✅ ฟังก์ชันสำหรับ get session with cache
const getCachedSession = async () => {
  const now = Date.now();
  
  // ถ้า cache ยังใหม่อยู่ ใช้ cache
  if (sessionCache && (now - sessionCacheTime) < CACHE_DURATION) {
    return sessionCache;
  }
  
  // ไม่งั้นดึง session ใหม่
  const session = await getSession();
  sessionCache = session;
  sessionCacheTime = now;
  
  return session;
}

const baseRequest = async (config: InternalAxiosRequestConfig) => {
  // ✅ ใช้ cached session แทน getSession() โดยตรง
  const session = await getCachedSession();

  if (config.headers && session?.user?.access_token) {
    config.headers.Authorization = `Bearer ${session.user.access_token}`;
  }

  return config;
}

const baseResponse = (response: AxiosResponse) => {
  return response;
}

let client = axios.create(baseConfig);

client.interceptors.request.use(baseRequest, (error: any) => {
  handleError(error);
  return Promise.reject(error);
});

client.interceptors.response.use(baseResponse, (error: any) => {
  handleError(error);
  return Promise.reject(error);
});

export default client;