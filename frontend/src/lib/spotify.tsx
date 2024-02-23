import { SPOTIFY_API_URL } from "@/config";
import { useNotificationsStore } from "@/stores/notifications";
import Axios from "axios";
import { authRequestInterceptor } from "./utlls";

export const spotify = Axios.create({
  baseURL: SPOTIFY_API_URL,
});

spotify.interceptors.request.use((config) =>
  authRequestInterceptor(config, "spotify")
);
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
  }
);
