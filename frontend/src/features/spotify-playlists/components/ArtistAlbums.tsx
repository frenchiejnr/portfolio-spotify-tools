import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import { spotify } from "@/lib/spotify";
import { CountComponent } from "@/features/listens/components/CountComponent";
import { MediaItemWithCount } from "@/features/listens/types";

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
  const [albumGroups, setAlbumGroups] = useState("all");
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

  const handleGroupChange = (event: React.ChangeEvent<{ value: string }>) => {
    setAlbumGroups(event.target.value);
  };

  const GroupDropdown = ({
    albumGroups,
    handleGroupChange,
  }: {
    albumGroups: string;
    handleGroupChange: (event: any) => void;
  }) => (
    <div className="text-center">
      <select
        value={albumGroups}
        onChange={handleGroupChange}
        className="text-base"
      >
        <option value="all">All</option>
        <option value="albums">Albums</option>
        <option value="non-albums">Non Albums</option>
      </select>
    </div>
  );

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
  const sortGroups = (data: SpotifyApi.AlbumObjectSimplified[]) => {
    switch (albumGroups) {
      case "all":
        return data;
      case "albums":
        return data.filter((album) => album.album_type === "album");
      case "non-albums":
        return data.filter((album) => album.album_type !== "album");
      default:
        return data;
    }
  };

  const data = sortGroups(sortAlbums(artistAlbums));

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
              {albumGroups !== "all" && <p>{data.length} Showing</p>}
              <p>
                {((albumCounts.length / artistAlbums.length) * 100).toFixed(2)}%
                Played
              </p>
            </div>
          </div>
          <div>
            <GroupDropdown
              albumGroups={albumGroups}
              handleGroupChange={handleGroupChange}
            />
            <Pagination
              totalCount={data.length}
              pageSize={10}
              data={data} // Pass sorted data to Pagination
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
