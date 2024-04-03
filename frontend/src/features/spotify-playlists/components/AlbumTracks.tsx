import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import { spotify } from "@/lib/spotify";
import { CountComponent } from "@/features/listens/components/CountComponent";
import { MediaItemWithCount } from "@/features/listens/types";

const AlbumTracks = ({
  sortMethod,
  songCounts,
  albumId,
}: {
  sortMethod: string;
  songCounts: MediaItemWithCount[];
  albumId: string;
}) => {
  const [albumTracks, setAlbumTracks] = useState<SpotifyApi.A[]>([]);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAllAlbumTracks = async () => {
      setIsLoading(true);
      const albumTracks: SpotifyApi.AlbumTracksResponse = await spotify.get(
        `/albums/${albumId}/tracks?limit=50`,
      );

      setAlbumTracks([...albumTracks.items]);
      setNextPageUrl(albumTracks.next);
      setIsLoading(false);
    };
    getAllAlbumTracks();
  }, []);

  useEffect(() => {
    const fetchMore = async () => {
      if (nextPageUrl && !isLoading) {
        setIsLoading(true);
        const fetchNextTracks = async (object, url?: string) => {
          if (!url) {
            return;
          }
          const newTracks: SpotifyApi.AlbumTracksResponse =
            await spotify.get(url);
          object.push(...newTracks.items);
          object.next = newTracks.next;
          return object;
        };
        const newTracks = await fetchNextTracks(
          albumTracks,
          nextPageUrl.split("/v1/")[1],
        );
        setAlbumTracks(newTracks.filter((item) => item !== null));
        setNextPageUrl(newTracks.next);
        setIsLoading(false);
      }
    };
    fetchMore();
  }, [nextPageUrl, isLoading, albumTracks]);

  const sortTracks = (data: SpotifyApi.TrackObjectSimplified[]) => {
    switch (sortMethod) {
      case "by-count":
        return data.sort((trackA, trackB) => {
          const countA =
            songCounts.find(
              (count: { id: string }) =>
                count.id === trackA.external_urls.spotify,
            )?.count || 0;
          const countB =
            songCounts.find(
              (count: { id: string }) =>
                count.id === trackB.external_urls.spotify,
            )?.count || 0;
          return countB - countA; // Sort in descending order
        });
      case "by-name":
        return data.sort((trackA, trackB) => {
          return trackA.name.localeCompare(trackB.name);
        });
      case "by-track-number":
        return data.sort((a, b) => {
          return a.track_number - b.track_number;
        });
      default:
        return data;
    }
  };

  return (
    <>
      {!isLoading && (
        <div>
          <p>
            {songCounts.length} of {albumTracks.length} Tracks
          </p>
          {((songCounts.length / albumTracks.length) * 100).toFixed(2)}% Played
        </div>
      )}
      <Pagination
        totalCount={albumTracks.length}
        pageSize={10}
        data={sortTracks(albumTracks)} // Pass sorted data to Pagination
        ItemComponent={CountComponent}
        songCounts={songCounts}
      />
    </>
  );
};

export default AlbumTracks;
