import { SPOTIFY_CLIENT_ID } from "@/config";
import storage from "@/utils/storage";

export const getRefreshToken = async () => {
  const refreshToken = storage.getRefreshToken("spotify");
  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: SPOTIFY_CLIENT_ID,
    }),
  };

  const body = await fetch(url, payload);
  const response = await body.json();

  storage.setToken("spotify", `Bearer ${response.access_token}`);
  storage.setRefreshToken("spotify", response.refresh_token);
  return storage.getToken("spotify");
};
