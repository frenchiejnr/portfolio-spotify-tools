import { API_URL } from "@/config";
import { useNotificationsStore } from "@/stores/notifications";
import storage from "@/utils/storage";
import Axios, { InternalAxiosRequestConfig } from "axios";

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = storage.getToken();
  if (token) {
    config.headers.authorization = `${token}`;
  }
  config.headers.Accept = "application/json";
  return config;
};

export const spotify = Axios.create({
  baseURL: API_URL,
});

spotify.interceptors.request.use(authRequestInterceptor);
spotify.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    useNotificationsStore.getState().addNotification({
      type: "error",
      title: "Error",
      message,
    });
    return Promise.reject(error);
  },
);
