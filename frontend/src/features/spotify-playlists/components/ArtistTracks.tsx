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
      const allTracks: SpotifyApi.TrackObjectSimplified[] = [];
      const artistAlbums: SpotifyApi.AlbumObjectSimplified[] = [];

      const includeGroups = ["album", "single", "appears_on", "compilation"];

      for (let i = 0; i < includeGroups.length; i++) {
        const includeGroup = includeGroups[i];

        // Fetch content for the current includeGroup
        const artistContentResponse: SpotifyApi.ArtistsAlbumsResponse =
          await spotify.get(
            `artists/${artistId}/albums?limit=50&include_groups=${includeGroup}`,
          );

        artistAlbums.push(...artistContentResponse.items);

        // Handle pagination (if applicable)
        while (artistContentResponse.next) {
          const newAlbums = await spotify.get(
            artistContentResponse.next.split("/v1/")[1],
          );
          artistAlbums.push(...newAlbums.items);
          artistContentResponse.next = newAlbums.next;
        }
      }

      // Fetch tracks for all albums (assuming artistAlbums is populated)
      for (const album of artistAlbums) {
        const albumTracks: SpotifyApi.AlbumTracksResponse = await spotify.get(
          `/albums/${album.id}/tracks`,
        );

        albumTracks.items = albumTracks.items.filter((track) =>
          track.artists.some((artist) => artist.id === artistId),
        );

        albumTracks.items.forEach((track) => {
          track.release_date = album.release_date; // Add a new property
        });

        allTracks.push(...albumTracks.items);
      }

      setArtistTracks(allTracks);
      setIsLoading(false);
    };

    getAllArtistTracks();
  }, [artistId]);

  const sortTracks = (data: SpotifyApi.TrackObjectFull[]) => {
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
      case "by-release-date":
        return data.sort((a, b) => {
          return new Date(b.release_date) - new Date(a.release_date);
        });
      default:
        return data;
    }
  };

  return (
    <>
      {isLoading ? (
        <p className="text-center">... Loading Artist Tracks</p>
      ) : (
        <>
          <div className="mt-1 flex w-full basis-1/12 flex-col justify-between rounded-xl bg-indigo-100 p-2 text-right">
            <div className="flex-grow">
              <p className="text-xl font-bold md:text-center">Tracks</p>
            </div>
            <div className="text-right text-sm">
              <p>
                {songCounts.length} of {artistTracks.length} Tracks
              </p>
              <p>
                {((songCounts.length / artistTracks.length) * 100).toFixed(2)}%
                Played
              </p>
            </div>
          </div>
          <div>
            <Pagination
              totalCount={artistTracks.length}
              pageSize={10}
              data={sortTracks(artistTracks)} // Pass sorted data to Pagination
              ItemComponent={CountComponent}
              songCounts={songCounts}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ArtistTracks;
