import { CLIENT_ID, REDIRECT_URI } from "@/config";
import storage from "@/utils/storage";
import { generateCodeVerifier, generateCodeChallenge } from "../utils";

export const requestUserAuthorization = async () => {
  const authUrl = new URL(`https://accounts.spotify.com/authorize`);
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  console.log(`code verifier`, codeVerifier);
  console.log(`code challenge`, codeChallenge);

  storage.setCodeVerifier(codeVerifier);

  const params = {
    response_type: "code",
    client_id: CLIENT_ID,
    scope: " ",
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: REDIRECT_URI,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("code");
};
