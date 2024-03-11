import { useEffect, useState } from "react";

import {
  handleGetMe,
  handleGetRecentlyPlayed,
} from "@/features/spotify-user-info";
import { ArtistsList } from "@/features/listens/components/ArtistsList";
import { AlbumsList } from "@/features/listens/components/AlbumsList";
import { TracksList } from "@/features/listens/components/TracksList";
import storage from "@/utils/storage";
import { getAccessToken } from "@/features/auth";
import {
  checkForListens,
  getListOfAlbums,
  getListOfArtists,
  getListOfTracks,
} from "@/features/listens/utils";
import Playlists from "@/features/spotify-playlists/components/Playlists";
import { AccessTokenButton } from "@/features/auth/components/AccessTokenButton";
import { RecentListens } from "@/features/listens/components/RecentListens";

function HomePage() {
  const [isFetchingListens, setIsFetchingListens] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    const retrieveSpotifyToken = async () => {
      const existingToken = storage.getToken("spotify");
      if (existingToken && existingToken !== "Bearer undefined") {
        // Token is present and valid, no need to fetch again
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

  useEffect(() => {
    getListens();
  }, []);
  const getListens = async () => {
    if (isFetchingListens) {
      return;
    }
    setIsFetchingListens(true);
    setRefresh(true);
    await checkForListens();
    setIsFetchingListens(false);
    setRefresh(false);
  };

  const handleListenBrainz = async () => {
    let response = await getListOfArtists();
    console.log(response);
    response = await getListOfAlbums();
    console.log(response);
    response = await getListOfTracks();
    console.log(response);
  };

  return (
    <>
      <button disabled={isFetchingListens} onClick={getListens}>
        Check For More Listens
      </button>
      <br />

      <button onClick={handleGetMe}>Get me</button>
      <button type="button" onClick={handleGetRecentlyPlayed}>
        Get recently played
      </button>
      <button onClick={handleListenBrainz}>Log on to listenbrainz</button>
      {isFetchingListens ? (
        <h1>Fetching Listens - Fetched x listens</h1>
      ) : (
        <>
          <br />
          {validToken ? <Playlists /> : <AccessTokenButton />}
          <br />
          <ArtistsList refresh={refresh} />
          <AlbumsList refresh={refresh} />
          <TracksList refresh={refresh} />
          <RecentListens refresh={refresh} />
        </>
      )}
    </>
  );
}

export default HomePage;