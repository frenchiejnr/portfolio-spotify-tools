import { useEffect, useState } from "react";
import "./App.css";
import { AccessTokenButton } from "./features/auth/components/AccessTokenButton";
import storage from "./utils/storage";
import { getAccessToken } from "./features/auth";
import {
  handleGetMe,
  handleGetRecentlyPlayed,
} from "@/features/spotify-user-info";
import {
  checkForListens,
  getListOfAlbums,
  getListOfArtists,
  getListOfTracks,
} from "./features/listens/utils";
import { ArtistsList } from "@/features/listens/components/ArtistsList";
import { AlbumsList } from "@/features/listens/components/AlbumsList";
import { TracksList } from "@/features/listens/components/TracksList";
import { RecentListens } from "./features/listens/components/RecentListens";

function App() {
  const [isFetchingListens, setIsFetchingListens] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      const args = new URLSearchParams(window.location.search);
      const code = args.get("code");
      if (code) {
        const token = await getAccessToken(code);
        storage.setToken("spotify", `Bearer ${token.access_token}`);
        storage.setAccessToken(token);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    getListens();
  }, []);
  const getListens = async () => {
    setIsFetchingListens(true);
    await checkForListens();
    setIsFetchingListens(false);
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
      <AccessTokenButton />
      <button onClick={handleGetMe}>Get me</button>
      <button type="button" onClick={handleGetRecentlyPlayed}>
        Get recently played
      </button>
      <button onClick={handleListenBrainz}>Log on to listenbrainz</button>
      <ArtistsList />
      <AlbumsList />
      <TracksList />
      <RecentListens />
    </>
  );
}

export default App;
