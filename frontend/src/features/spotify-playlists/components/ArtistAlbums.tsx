import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import { spotify } from "@/lib/spotify";
import { CountComponent } from "@/features/listens/components/CountComponent";
import { MediaItemWithCount } from "@/features/listens/types";
import { log } from "console";

const ArtistAlbums = ({
  sortMethod,
  albumCounts,
  artistId,
}: {
  sortMethod: string;
  albumCounts: MediaItemWithCount[];
  artistId: string;
}) => {
  const [artistAlbums, setArtistAlbums] = useState<
    SpotifyApi.AlbumObjectSimplified[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>();

  useEffect(() => {
    const fetchArtistContent = async (includeGroup) => {
      setIsLoading(true);

      try {
        const artistContentResponse: SpotifyApi.ArtistsItemsResponse =
          await spotify.get(
            `artists/${artistId}/albums?limit=50&include_groups=${includeGroup}`,
          );

        setArtistAlbums((prevAlbums) => [
          ...prevAlbums,
          ...artistContentResponse.items,
        ]);

        setNextPageUrl(artistContentResponse.next);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAllContent = async () => {
      const includeGroups = ["album", "single", "appears_on", "compilation"];

      for (const includeGroup of includeGroups) {
        await fetchArtistContent(includeGroup);

        // Fetch more for the current includeGroup if nextPageUrl exists
        while (nextPageUrl) {
          const newAlbums = await spotify.get(nextPageUrl.split("/v1/")[1]);
          setArtistAlbums((prevAlbums) => [...prevAlbums, ...newAlbums.items]);
          setNextPageUrl(newAlbums.next);
        }
      }
    };

    setArtistAlbums([]);
    fetchAllContent();
  }, [artistId]);

  const sortAlbums = (data: SpotifyApi.AlbumObjectSimplified[]) => {
    switch (sortMethod) {
      case "by-count":
        return data.sort((albumA, albumB) => {
          const countA =
            albumCounts.find(
              (count: { id: string }) =>
                count.id === albumA.external_urls.spotify,
            )?.count || 0;
          const countB =
            albumCounts.find(
              (count: { id: string }) =>
                count.id === albumB.external_urls.spotify,
            )?.count || 0;
          return countB - countA; // Sort in descending order
        });
      case "by-name":
        return data.sort((trackA, trackB) => {
          return trackA.name.localeCompare(trackB.name);
        });
      case "by-release-date":
        return data.sort((albumA, albumB) => {
          return new Date(albumB.release_date) - new Date(albumA.release_date);
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
              <p className="text-xl font-bold md:text-center">Albums</p>
            </div>

            <div className="text-right text-sm">
              <p>
                {albumCounts.length} of {artistAlbums.length} Albums
              </p>
              <p>
                {((albumCounts.length / artistAlbums.length) * 100).toFixed(2)}%
                Played
              </p>
            </div>
          </div>
          <div>
            <Pagination
              totalCount={artistAlbums.length}
              pageSize={10}
              data={sortAlbums(artistAlbums)} // Pass sorted data to Pagination
              ItemComponent={CountComponent}
              songCounts={albumCounts}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ArtistAlbums;
