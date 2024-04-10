import { useEffect, useState } from "react";

import storage from "@/utils/storage";
import { checkTokenValidity, getAccessToken } from "@/features/auth";
import { LoginButton } from "@/features/auth/components/LoginButton";
import { HomeContent } from "./HomeContent";

function HomePage() {
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    const retrieveSpotifyToken = async () => {
      const hasValidToken = checkTokenValidity();
      if (hasValidToken) {
        setValidToken(true);
        return;
      }
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get("code");
      if (authCode) {
        const tokenResponse = await getAccessToken(authCode);
        const { access_token, refresh_token, expires_in } = tokenResponse;
        storage.setToken("spotify", `Bearer ${access_token}`);
        storage.setRefreshToken("spotify", `${refresh_token}`);
        storage.setExpiresIn("spotify", `${parseInt(expires_in)}`);
        setValidToken(true);
        return;
      }
      setValidToken(false);
    };
    retrieveSpotifyToken();
  }, []);

  return (
    <>
      {validToken ? (
        <HomeContent />
      ) : (
        <div className="flex content-center justify-center">
          <LoginButton />
        </div>
      )}
    </>
  );
}

export default HomePage;
