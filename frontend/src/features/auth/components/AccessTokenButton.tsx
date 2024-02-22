import { getAccessToken, requestUserAuthorization } from "..";

export const AccessTokenButton = () => {
  return (
    <button
      onClick={async () => {
        // Retrieve authorization code
        await requestUserAuthorization();

        const args = new URLSearchParams(window.location.search);
        const code = args.get("code");
        await getAccessToken(code!);
      }}
    >
      Access Token Button
    </button>
  );
};
