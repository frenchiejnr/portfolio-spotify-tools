import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { AccessTokenButton } from "./features/auth/components/AccessTokenButton";
import storage from "./utils/storage";
import { getAccessToken } from "./features/auth";
import {
  handleGetMe,
  handleGetRecentlyPlayed,
} from "./features/spotify-user-info";
import {
  getListOfAlbums,
  getListOfArtists,
  getListOfTracks,
  listens,
} from "./features/listens";

function App() {
  const [count, setCount] = useState(0);

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
    let response = await getListOfArtists(listens);
    console.log(response);
    response = await getListOfAlbums(listens);
    console.log(response);
    response = await getListOfTracks(listens);
    console.log(response);
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <AccessTokenButton />
      <button onClick={handleGetMe}>Get me</button>
      <button type="button" onClick={handleGetRecentlyPlayed}>
        Get recently played
      </button>
      <button onClick={handleListenBrainz}>Log on to listenbrainz</button>
    </>
  );
}

export default App;
