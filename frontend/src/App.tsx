import { useEffect } from "react";
import "./App.css";
import { AccessTokenButton } from "./features/auth/components/AccessTokenButton";
import storage from "./utils/storage";
import { getAccessToken } from "./features/auth";
import {
  handleGetMe,
  handleGetRecentlyPlayed,
} from "@/features/spotify-user-info";
import {
  getListOfAlbums,
  getListOfArtists,
  getListOfTracks,
} from "./features/listens";
import { ArtistsList } from "@/features/listens/components/ArtistsList";
import { AlbumsList } from "@/features/listens/components/AlbumsList";
import { TracksList } from "@/features/listens/components/TracksList";

function App() {
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
      <AccessTokenButton />
      <button onClick={handleGetMe}>Get me</button>
      <button type="button" onClick={handleGetRecentlyPlayed}>
        Get recently played
      </button>
      <button onClick={handleListenBrainz}>Log on to listenbrainz</button>
      <ArtistsList />
      <AlbumsList />
      <TracksList />
    </>
  );
}

export default App;
