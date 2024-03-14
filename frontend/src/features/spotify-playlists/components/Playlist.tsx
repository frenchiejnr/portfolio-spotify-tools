import Pagination from "@/components/Pagination";
import { Link, useLoaderData } from "react-router-dom";
import { PlaylistTracks } from "./PlaylistTracks";
import { useEffect, useState } from "react";
import { fetchNextTracks } from "@/routes/fetchPlaylist";
import { getData } from "@/utils/indexDB";
import { Listen } from "@/features/listens/types";

const Playlist = () => {
  const [playlistData, setPlaylistData] =
    useState<SpotifyApi.PlaylistObjectFull>(useLoaderData());
  const [nextUrl, setNextUrl] = useState<string | null>(
    playlistData.tracks.next,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [songCounts, setSongCounts] = useState({});

  useEffect(() => {
    const fetchMoreTracks = async () => {
      if (nextUrl && !isLoading) {
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
          setNextUrl(null);
        }
        setIsLoading(false);
      }
    };
    fetchMoreTracks();
  }, [nextUrl, isLoading]);

  useEffect(() => {
    const getSongPlays = async () => {
      const listens: Listen[] = await getData("listens");

      const counts = listens.reduce((acc, listen) => {
        const spotify_id =
          listen.track_metadata.additional_info.spotify_id?.split("/track/")[1];
        acc[spotify_id] = (acc[spotify_id] || 0) + 1;
        return acc;
      }, {});
      setSongCounts(counts);
    };
    getSongPlays();
  }, []);

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
      <div className="flex w-4/5 justify-between mx-auto">
        <div className=" ml-1 basis-1/4">
          <p>Track Name</p>
        </div>
        <div className=" ml-1 basis-1/4 ">
          <p>Artist Name</p>
        </div>
        <div className=" ml-1 basis-1/4">
          <p>Album Name</p>
        </div>
        <div className=" ml-1 basis-1/4">
          <p>Number of Listens</p>
        </div>
      </div>
      <Pagination
        totalCount={playlistData.tracks.items.length}
        pageSize={10}
        data={playlistData.tracks.items}
        ItemComponent={PlaylistTracks}
        songCounts={songCounts}
      />
    </>
  );
};

export default Playlist;
