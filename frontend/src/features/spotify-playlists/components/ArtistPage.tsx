import Pagination from "@/components/Pagination";
import { ListenComponent } from "@/features/listens/components/Listen";
import { useMediaPlays } from "@/hooks/useMediaPlays";
import { useMediaInfo } from "@/hooks/useMediaInfo";
import { useParams } from "react-router-dom";
import { spotify } from "@/lib/spotify";
import { useEffect, useState } from "react";
import { CountComponent } from "@/features/listens/components/CountComponent";
import { countItems } from "@/features/listens/utils";
import ArtistInfo from "./ArtistInfo";
import ArtistSortDropdown from "./ArtistSortDropdown";
import ArtistTracks from "./ArtistTracks";
import { useRecentListens } from "@/features/listens/components/useRecentListens";
import { RecentListensDisplay } from "@/features/listens/components/RecentListensDisplay";

export const ArtistPage = () => {
  const { artistId } = useParams();
  const songPlays = useMediaPlays(artistId!, "artist");
  const [sortMethod, setSortMethod] = useState("by-count");
  const [songCounts, setSongCounts] = useState([]);
  const { data, dataLength, isLoading } = useRecentListens(
    "listens",
    (a, b) => b.listened_at - a.listened_at,
  );

  useEffect(() => {
    const getSongCounts = async () => {
      const counts = await countItems(songPlays, "track_name");
      setSongCounts(counts);
    };
    getSongCounts();
  }, [songPlays]);

  const handleSortChange = (event) => {
    setSortMethod(event.target.value);
  };

  return (
    <>
      <ArtistInfo />
      <ArtistSortDropdown
        sortMethod={sortMethod}
        handleSortChange={handleSortChange}
      />
      <ArtistTracks
        sortMethod={sortMethod}
        songCounts={songCounts}
        artistId={artistId}
      />
      <RecentListensDisplay
        data={songPlays}
        isLoading={isLoading}
        dataLength={songPlays.length}
        ItemComponent={ListenComponent}
        title={"Recent Listens"}
        totalLabel={"Listens"}
      />
    </>
  );
};
