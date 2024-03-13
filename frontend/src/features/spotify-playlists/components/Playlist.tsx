import Pagination from "@/components/Pagination";
import { Link, useLoaderData } from "react-router-dom";
import { PlaylistTracks } from "./PlaylistTracks";
import { useEffect, useState } from "react";
import { fetchNextTracks } from "@/routes/fetchPlaylist";

const Playlist = () => {
  const [playlistData, setPlaylistData] =
    useState<SpotifyApi.PlaylistObjectFull>(useLoaderData());
  const [nextUrl, setNextUrl] = useState<string | null>(
    playlistData.tracks.next,
  );
  const [isLoading, setIsLoading] = useState(false); // New state variable

  useEffect(() => {
    const fetchMoreTracks = async () => {
      if (nextUrl && !isLoading) {
        // Fetch only if nextUrl exists and not loading
        setIsLoading(true);
        const newPlaylistData = await fetchNextTracks(
          playlistData,
          nextUrl.split("/v1/")[1],
        );
        const nextTracksUrl = newPlaylistData.tracks.next;
        setPlaylistData(newPlaylistData);
        if (nextTracksUrl) {
          setNextUrl(nextTracksUrl);
        } else {
          setNextUrl(null); // Set nextUrl to null if no further data
        }
        setIsLoading(false);
      }
    };
    fetchMoreTracks();
  }, [nextUrl, isLoading]);

  return (
    <>
      <div>{playlistData.name}</div>
      <div>{playlistData.tracks.total} tracks</div>
      <Link to={"/playlists"}>Back to Playlists</Link>
      {isLoading && (
        <p>
          {playlistData.tracks.items.length} of {playlistData.tracks.total}{" "}
          Loaded
        </p>
      )}{" "}
      {/* Display loading indicator */}
      <Pagination
        totalCount={playlistData.tracks.items.length}
        pageSize={10}
        data={playlistData.tracks.items}
        ItemComponent={PlaylistTracks}
      />
    </>
  );
};

export default Playlist;
