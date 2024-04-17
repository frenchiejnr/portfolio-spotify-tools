import { useLoaderData } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { PlaylistHeader } from "./PlaylistHeader";
import { PlaylistTracksTable } from "./PlaylistTracksTable";

// Services
import { fetchNextTracks as fetchMoreTracks } from "@/routes/fetchPlaylist";
import { getData as getSongPlays } from "@/utils/indexDB";

//Types
import { Listen } from "@/features/listens/types";
import { LinkBar } from "@/components/LinkBar";

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
    <>
      <LinkBar />
      <div className="m-auto flex h-dvh w-5/6 flex-col">
        <div className="basis-1/6">
          <PlaylistHeader
            filteredTracks={filteredTracks}
            isLoading={isLoading}
            playlist={playlist}
            setShowUnplayedOnly={setShowUnplayedOnly}
            showUnplayedOnly={showUnplayedOnly}
          />
        </div>
        <div className="basis-5/6">
          <PlaylistTracksTable
            filteredTracks={filteredTracks}
            songCounts={songCounts}
          />
        </div>
      </div>
    </>
  );
};

export default Playlist;
