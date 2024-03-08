import storage from "@/utils/storage";
import { checkForValidAccessToken } from "./checkForValidAccessToken";

export const getSpotifyAuthToken = async () => {
  const token = await checkForValidAccessToken();

  if (token) {
    storage.setToken("spotify", `Bearer ${token.access_token}`);
    storage.setRefreshToken("spotify", `${token.refresh_token}`);
    storage.setExpiresIn("spotify", `${parseInt(token.expires_in)}`);
    return true;
  }
  return false;
};
