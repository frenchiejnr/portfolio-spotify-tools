import {
  getAccessToken,
  getSpotifyAuthToken,
  requestUserAuthorization,
} from "..";

export const LoginButton = () => {
  return (
    <button
      onClick={async () => {
        await getSpotifyAuthToken();
        // Retrieve authorization code
        await requestUserAuthorization();

        const args = new URLSearchParams(window.location.search);
        const code = args.get("code");
        await getAccessToken(code!);
      }}
    >
      Login Button
    </button>
  );
};
