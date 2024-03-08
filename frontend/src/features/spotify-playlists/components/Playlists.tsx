import Pagination from "@/components/Pagination";
import { getSpotifyAuthToken } from "@/features/auth";
import { checkForValidAccessToken } from "@/features/auth/api/checkForValidAccessToken";
import { ListComponent } from "@/features/listens/components/ListComponent";
import { spotify } from "@/lib/spotify";
import { useEffect, useState } from "react";

const Playlists = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getPlaylists = async () => {
      const isTokenValid = await checkForValidAccessToken();
      if (isTokenValid) {
        const response = await spotify.get("/me/playlists");
        console.log(response);
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
        ItemComponent={ListComponent}
      />
    </>
  );
};

export default Playlists;
