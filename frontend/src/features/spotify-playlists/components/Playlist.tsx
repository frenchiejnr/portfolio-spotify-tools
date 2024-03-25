import Pagination from "@/components/Pagination";
import { Link, useLoaderData } from "react-router-dom";
import { PlaylistTracks } from "./PlaylistTracks";
import { useEffect, useMemo, useState } from "react";

// Services
import { fetchNextTracks as fetchMoreTracks } from "@/routes/fetchPlaylist";
import { getData as getSongPlays } from "@/utils/indexDB";

//Types
import { Listen } from "@/features/listens/types";

const Playlist = () => {
  const [playlist, setPlaylist] =
    useState<SpotifyApi.PlaylistObjectFull>(useLoaderData());
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(
    playlist?.tracks?.next,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [songCounts, setSongCounts] = useState({});
  const [showUnplayedOnly, setShowUnplayedOnly] = useState(false);

  useEffect(() => {
    const fetchMore = async () => {
      if (nextPageUrl && !isLoading) {
        setIsLoading(true);
        const newPlaylist = await fetchMoreTracks(
          playlist,
          nextPageUrl.split("/v1/")[1],
        );
        setPlaylist(newPlaylist);
        setNextPageUrl(newPlaylist.tracks.next);
        const nextTracksUrl = newPlaylist.tracks.next;
        setIsLoading(false);
      }
    };
    fetchMore();
  }, [nextPageUrl, isLoading, playlist]);

  useEffect(() => {
    const getPlays = async () => {
      const listens: Listen[] = await getSongPlays("listens");
      const counts = listens.reduce((acc, listen) => {
        const trackId =
          listen.track_metadata.additional_info.spotify_id?.split("/track/")[1];
        acc[trackId] = (acc[trackId] || 0) + 1;
        return acc;
      }, {});
      setSongCounts(counts);
    };
    getPlays();
  }, []);

  const filteredTracks = useMemo(() => {
    if (!showUnplayedOnly) {
      return playlist.tracks?.items || [];
    } else {
      return (playlist.tracks?.items || []).filter(
        (track) => !songCounts[track.track.id],
      );
    }
  }, [[playlist.tracks?.items, songCounts, showUnplayedOnly]]);

  return (
    <>
      <div>{playlist.name}</div>
      <div>{filteredTracks.length} tracks</div>
      <Link to={"/playlists"}>Back to Playlists</Link>
      {isLoading && (
        <p>
          {playlist.tracks?.items?.length} of {playlist.tracks?.total} Loaded
        </p>
      )}
      <label for="no-listens">
        <input
          type="checkbox"
          id="no-listens"
          checked={showUnplayedOnly}
          onChange={(e) => setShowUnplayedOnly(e.target.checked)}
        />
        Show Unplayed Songs only
      </label>
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
        totalCount={filteredTracks.length}
        pageSize={10}
        data={filteredTracks}
        ItemComponent={PlaylistTracks}
        songCounts={songCounts}
      />
    </>
  );
};

export default Playlist;
