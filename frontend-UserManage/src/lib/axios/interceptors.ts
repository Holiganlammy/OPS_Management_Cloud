import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getSession, signOut, useSession } from "next-auth/react";
import { Toast } from "../alert/toast";
import Swal from "sweetalert2";


const http = process.env.NEXT_PUBLIC_API_URL;


export const error401 = () => {
  signOut({ callbackUrl: '/login' })
}
export const error403 = () => {
  window.location.href = '/home'
}


function hadleError(err: any) {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 400) {
      Toast.fire({
        icon: "error",
        title: err.response.data.message,
        text: err.response.data.error.code + " : " + err.response.data.error.path[0] || "Sometjing went wrong."
      });
    }

    if (err.response?.status === 401) {
      error401()
    }
    Swal.fire({
      icon: 'error',
      title: 'Error403',
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      error403()
    });
  } else {
    alert('Sometjing went wrong.')
  }
}

const CancelToken = axios.CancelToken
const source = CancelToken.source()

// Configuration object for Axios
const baseConfig: AxiosRequestConfig = {
  baseURL: http,
  cancelToken: source.token,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
};

// Function to handle the request before it is sent
const baseRequest = async (config: InternalAxiosRequestConfig) => {
  const session = await getSession()

  if (config.headers) {
    config.headers.Authorization = session?.user.access_token ? `Bearer ${session?.user.access_token}` : null;
  }

  // console.groupCollapsed(`before interceptors : ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  console.groupCollapsed(`before interceptors : ${config.method?.toUpperCase()} ${config.url}`);
  console.groupCollapsed("config");
  console.log(config);
  console.groupEnd();
  console.groupCollapsed("headers");
  console.log(config.headers);
  console.log();
  console.groupEnd();
  console.groupCollapsed("body");
  console.log(config.data);
  console.groupEnd();
  console.groupEnd();

  return config;
}

const baseResponse = (response: AxiosResponse) => {
  // console.groupCollapsed(`response: ${response.config.method?.toUpperCase()} ${response.config.baseURL}${response.config.url}`);
  console.groupCollapsed(`response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
  console.log(response);
  console.groupEnd();

  return response;
}
let client = axios.create(baseConfig);
client.interceptors.request.use(baseRequest, (error: any) => {

  hadleError(error);
  //return error;
  return Promise.reject(error);
});

client.interceptors.response.use(baseResponse, (error: any) => {

  hadleError(error);
  //return error;
  return Promise.reject(error);
});

export default client;
