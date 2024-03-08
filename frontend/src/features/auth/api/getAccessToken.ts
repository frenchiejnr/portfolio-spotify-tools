import { SPOTIFY_CLIENT_ID, REDIRECT_URI } from "@/config";
import storage from "@/utils/storage";

export const getAccessToken = async (code: string) => {
  const code_verifier = storage.getCodeVerifier();
  if (!code) {
    throw new Error("Missing code_verifier");
  }

  const tokenEndpoint = "https://accounts.spotify.com/api/token";

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: code_verifier!,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch access token: ${response.status}`);
  }

  return await response.json();
};
