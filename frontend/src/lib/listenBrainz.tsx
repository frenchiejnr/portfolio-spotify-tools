import { LISTENBRAINZ_API_URL, LISTENBRAINZ_CLIENT_ID } from "@/config";
import Axios from "axios";
import { authRequestInterceptor } from "./utlls";
import { useNotificationsStore } from "@/stores/notifications";
import storage from "@/utils/storage";

storage.setToken("listenBrainz", `Token ${LISTENBRAINZ_CLIENT_ID}`);

export const listenBrainz = Axios.create({
  baseURL: LISTENBRAINZ_API_URL,
});

listenBrainz.interceptors.request.use((config) =>
  authRequestInterceptor(config, "listenBrainz")
);
listenBrainz.interceptors.response.use(
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
