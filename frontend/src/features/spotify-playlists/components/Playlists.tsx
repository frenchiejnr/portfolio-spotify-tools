import Pagination from "@/components/Pagination";
import { checkForValidAccessToken } from "@/features/auth/api/checkForValidAccessToken";
import { spotify } from "@/lib/spotify";
import { useEffect, useState } from "react";
import { PlaylistItems } from "./PlaylistItems";

const Playlists = () => {
  const [data, setData] = useState([]);
  const [userName, setUsername] = useState();
  useEffect(() => {
    const getPlaylists = async () => {
      const isTokenValid = await checkForValidAccessToken();
      if (isTokenValid) {
        // TODO
        // IF MORE THAN 50 playlists, get all of them.
        const response = await spotify.get("me/playlists?limit=50");
        const userNameResponse = await spotify.get("me");

        setUsername(() => userNameResponse.display_name);
        setData(() => response.items);
      }
    };
    getPlaylists();
  }, []);
  return (
    <div className="m-auto flex h-dvh w-5/6 flex-col">
      <div className="mt-1 w-full flex-grow basis-1/12 rounded-xl bg-indigo-200 p-2 text-right md:text-center">
        <h1 className="text-xl font-bold">{userName}s' Playlists</h1>
        <p className="semi-bold text-lg">{data?.length} Playlists</p>
      </div>
      <div className="basis-11/12">
        <Pagination
          totalCount={data.length}
          pageSize={10}
          data={data}
          ItemComponent={PlaylistItems}
        />
      </div>
    </div>
  );
};

export default Playlists;
