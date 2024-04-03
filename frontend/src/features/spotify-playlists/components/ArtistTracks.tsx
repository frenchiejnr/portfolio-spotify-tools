import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import { spotify } from "@/lib/spotify";
import { CountComponent } from "@/features/listens/components/CountComponent";
import { MediaItemWithCount } from "@/features/listens/types";

const ArtistTracks = ({
  sortMethod,
  songCounts,
  artistId,
}: {
  sortMethod: string;
  songCounts: MediaItemWithCount[];
  artistId: string;
}) => {
  const [artistTracks, setArtistTracks] = useState<
    SpotifyApi.TrackObjectSimplified[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAllArtistTracks = async () => {
      setIsLoading(true);
      const artistAlbums: SpotifyApi.ArtistsAlbumsResponse = await spotify.get(
        `artists/${artistId}/albums?limit=50`,
      );
      const allTracks: SpotifyApi.TrackObjectSimplified[] = [];

      for (const album of artistAlbums.items) {
        const albumTracks: SpotifyApi.AlbumTracksResponse = await spotify.get(
          `/albums/${album.id}/tracks`,
        );
        allTracks.push(...albumTracks.items);
      }

      setArtistTracks(allTracks);
      setIsLoading(false);
    };
    getAllArtistTracks();
  }, []);

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
            {songCounts.length} of {artistTracks.length} Tracks
          </p>
          {((songCounts.length / artistTracks.length) * 100).toFixed(2)}% Played
        </div>
      )}
      <Pagination
        totalCount={artistTracks.length}
        pageSize={10}
        data={sortTracks(artistTracks)} // Pass sorted data to Pagination
        ItemComponent={CountComponent}
        songCounts={songCounts}
      />
    </>
  );
};

export default ArtistTracks;
