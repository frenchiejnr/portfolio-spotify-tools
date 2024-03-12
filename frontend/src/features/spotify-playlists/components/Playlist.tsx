import Pagination from "@/components/Pagination";
import { useLoaderData } from "react-router-dom";
import { PlaylistTracks } from "./PlaylistTracks";

const Playlist = () => {
  const playlistData: SpotifyApi.PlaylistObjectFull = useLoaderData();

  const tracks = playlistData.tracks;

  return (
    <>
      <div>{playlistData.name}</div>
      <Pagination
        totalCount={tracks.items.length}
        pageSize={10}
        data={tracks.items}
        ItemComponent={PlaylistTracks}
      />
    </>
  );
};

export default Playlist;
