import storage from "@/utils/storage";
import { InternalAxiosRequestConfig } from "axios";

export const authRequestInterceptor = (
  config: InternalAxiosRequestConfig,
  service: string
) => {
  const token = storage.getToken(service);
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  config.headers.Accept = "application/json";
  return config;
};
