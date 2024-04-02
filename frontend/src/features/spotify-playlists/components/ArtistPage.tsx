import Pagination from "@/components/Pagination";
import { ListenComponent } from "@/features/listens/components/Listen";
import { useMediaPlays } from "@/hooks/useMediaPlays";
import { useMediaInfo } from "@/hooks/useMediaInfo";
import { useParams } from "react-router-dom";
import { spotify } from "@/lib/spotify";
import { useEffect, useState } from "react";
import { CountComponent } from "@/features/listens/components/CountComponent";
import { countItems } from "@/features/listens/utils";

export const ArtistPage = () => {
  const { artistId } = useParams();

  const { mediaInfo, isLoading } = useMediaInfo(artistId!, "artist");
  const songPlays = useMediaPlays(artistId!, "artist");
  const [artistTracks, setArtistTracks] = useState([]);
  const [songCounts, setSongCounts] = useState([]);

  useEffect(() => {
    const getSongCounts = async () => {
      const counts = await countItems(songPlays, "track_name");
      setSongCounts(counts);

      artistTracks.sort((trackA, trackB) => {
        // Use songCounts to determine the count for each track
        const countA =
          counts.find((count) => count.id === trackA.external_urls.spotify)
            ?.count || 0;
        const countB =
          counts.find((count) => count.id === trackB.external_urls.spotify)
            ?.count || 0;

        return countB - countA; // Sort in descending order
      });

      // Sort alphabetically by track name
      // const sortedTracks = artistTracks.sort((trackA, trackB) => {
      //   return trackA.name.localeCompare(trackB.name);
      // });
      // const sortedByTrackNumber = artistTracks.sort((a, b) => {
      //   return a.track_number - b.track_number;
      // });
      console.log(artistTracks);

      setArtistTracks(artistTracks);
    };
    getSongCounts();
  }, [artistTracks]);

  useEffect(() => {
    const getAllArtistTracks = async () => {
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
    };
    getAllArtistTracks();
  }, []);
  return (
    <>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <>
          <div>
            {mediaInfo?.name} - {songPlays?.length} Plays
          </div>
          <Pagination
            totalCount={artistTracks.length}
            pageSize={10}
            data={artistTracks} // Use the sortedTracks directly
            ItemComponent={CountComponent}
            songCounts={songCounts}
          />
          <div>Recent Listens</div>
          <Pagination
            totalCount={songPlays?.length}
            pageSize={10}
            data={songPlays}
            ItemComponent={ListenComponent}
          />
        </>
      )}
    </>
  );
};
