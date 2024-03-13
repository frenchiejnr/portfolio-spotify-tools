import Pagination from "@/components/Pagination";
import { checkForValidAccessToken } from "@/features/auth/api/checkForValidAccessToken";
import { spotify } from "@/lib/spotify";
import { useEffect, useState } from "react";
import { PlaylistItems } from "./PlaylistItems";

const Playlists = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getPlaylists = async () => {
      const isTokenValid = await checkForValidAccessToken();
      if (isTokenValid) {
        // TODO
        // IF MORE THAN 50 playlists, get all of them.
        const response = await spotify.get("me/playlists?limit=50");
        setData(() => response.items);
      }
    };
    getPlaylists();
  }, []);
  return (
    <>
      <h1>Playlists</h1>
      <Pagination
        totalCount={data.length}
        pageSize={10}
        data={data}
        ItemComponent={PlaylistItems}
      />
    </>
  );
};

export default Playlists;
