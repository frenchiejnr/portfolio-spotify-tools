import { useLoaderData } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { PlaylistHeader } from "./PlaylistHeader";
import { PlaylistTracksTable } from "./PlaylistTracksTable";

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
        (track) => track.track && !songCounts[track.track.id],
      );
    }
  }, [[playlist.tracks?.items, songCounts, showUnplayedOnly]]);

  return (
    <div className="m-auto flex h-dvh w-5/6 flex-col">
      <PlaylistHeader
        filteredTracks={filteredTracks}
        isLoading={isLoading}
        playlist={playlist}
        setShowUnplayedOnly={setShowUnplayedOnly}
        showUnplayedOnly={showUnplayedOnly}
      />
      <PlaylistTracksTable
        filteredTracks={filteredTracks}
        songCounts={songCounts}
      />
    </div>
  );
};

export default Playlist;
