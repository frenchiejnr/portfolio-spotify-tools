import Pagination from "@/components/Pagination";
import { Link, useLoaderData } from "react-router-dom";
import { PlaylistTracks } from "./PlaylistTracks";

const Playlist = () => {
  const playlistData: SpotifyApi.PlaylistObjectFull = useLoaderData();

  const tracks = playlistData.tracks;
  //TODO GET ALL TRACKS IF THERE IS A NEXT PARAM IN THE RESPONSE

  return (
    <>
      <div>{playlistData.name}</div>
      <Link to={"/playlists"}>Back to Playlists</Link>
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
