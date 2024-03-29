import { useEffect, useState } from "react";

import {
  handleGetMe,
  handleGetRecentlyPlayed,
} from "@/features/spotify-user-info";
import storage from "@/utils/storage";
import { getAccessToken } from "@/features/auth";
import {
  checkForListens,
  getListOfAlbums,
  getListOfArtists,
  getListOfTracks,
} from "@/features/listens/utils";
import { AccessTokenButton } from "@/features/auth/components/AccessTokenButton";
import { RecentListens } from "@/features/listens/components/RecentListens";
import { Link } from "react-router-dom";
import { Listen } from "@/features/listens/types";
import { getData, setData } from "@/utils/indexDB";

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
    console.log(`Finished Refreshing Listens`);
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

  const handleListensWithoutId = async () => {
    const listens: Listen[] = await getData("listens");

    console.log(
      listens.filter(
        (listen) => !listen.track_metadata.additional_info.spotify_id,
      ).length,
    );
    listens
      .filter((listen) => !listen.track_metadata.additional_info.spotify_id)
      .forEach((listen: Listen) => {
        const listenWithId = listens.find(
          (item: Listen) =>
            item.track_metadata.track_name ===
              listen.track_metadata.track_name &&
            item.track_metadata.release_name ===
              listen.track_metadata.release_name &&
            item.track_metadata.artist_name ===
              listen.track_metadata.artist_name &&
            item.track_metadata.additional_info.spotify_id,
        );

        if (listenWithId) {
          listen.track_metadata.additional_info.spotify_id =
            listenWithId.track_metadata.additional_info.spotify_id;
          listen.track_metadata.additional_info.spotify_artist_ids =
            listenWithId.track_metadata.additional_info.spotify_artist_ids;
          listen.track_metadata.additional_info.spotify_album_id =
            listenWithId.track_metadata.additional_info.spotify_album_id;
        }
      });
    console.log(
      listens.filter(
        (listen) => !listen.track_metadata.additional_info.spotify_id,
      ).length,
    );
    setData("listens", listens);
  };

  return (
    <>
      <button disabled={isFetchingListens} onClick={getListens}>
        Check For More Listens
      </button>
      <br />
      {validToken ? (
        <Link to={"/playlists"}>Playlists</Link>
      ) : (
        <AccessTokenButton />
      )}

      <Link to={"/album"}>Albums</Link>
      <Link to={"/artist"}>Artists</Link>
      <Link to={"/track"}>Tracks</Link>
      <button onClick={handleGetMe}>Get me</button>
      <button type="button" onClick={handleGetRecentlyPlayed}>
        Get recently played
      </button>
      <button onClick={handleListenBrainz}>Log on to listenbrainz</button>
      <button onClick={handleListensWithoutId}>Songs missing spotify Id</button>
      {isFetchingListens ? (
        <h1>Fetching Listens - Fetched x listens</h1>
      ) : (
        <>
          <RecentListens refresh={refresh} />
        </>
      )}
    </>
  );
}

export default HomePage;
