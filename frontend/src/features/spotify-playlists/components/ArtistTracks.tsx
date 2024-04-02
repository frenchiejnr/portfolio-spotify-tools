import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import { spotify } from "@/lib/spotify";
import { CountComponent } from "@/features/listens/components/CountComponent";

const ArtistTracks = ({ sortMethod, songCounts, artistId }) => {
  const [artistTracks, setArtistTracks] = useState([]);

  useEffect(() => {
    const getAllArtistTracks = async () => {
      const artistAlbums = await spotify.get(
        `artists/${artistId}/albums?limit=50`,
      );
      const allTracks: SpotifyApi.TrackObjectSimplified[] = [];

      for (const album of artistAlbums.items) {
        const albumTracks = await spotify.get(`/albums/${album.id}/tracks`);
        allTracks.push(...albumTracks.items);
      }

      setArtistTracks(allTracks);
    };

    getAllArtistTracks();
  }, []);

  const sortTracks = (data) => {
    switch (sortMethod) {
      case "by-count":
        return data.sort((trackA, trackB) => {
          const countA =
            songCounts.find(
              (count) => count.id === trackA.external_urls.spotify,
            )?.count || 0;
          const countB =
            songCounts.find(
              (count) => count.id === trackB.external_urls.spotify,
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
    <Pagination
      totalCount={artistTracks.length}
      pageSize={10}
      data={sortTracks(artistTracks)} // Pass sorted data to Pagination
      ItemComponent={CountComponent}
      songCounts={songCounts}
    />
  );
};

export default ArtistTracks;
