import { SPOTIFY_CLIENT_ID, REDIRECT_URI } from "@/config";

export async function getAccessToken(code: string) {
  const code_verifier = localStorage.getItem("code_verifier");
  const tokenEndpoint = "https://accounts.spotify.com/api/token";

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: REDIRECT_URI,
      code_verifier: code_verifier!,
    }),
  });

  return await response.json();
}
