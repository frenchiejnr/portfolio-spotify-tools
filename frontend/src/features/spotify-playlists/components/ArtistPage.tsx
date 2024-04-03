import { ListenComponent } from "@/features/listens/components/Listen";
import { useMediaPlays } from "@/hooks/useMediaPlays";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { countItems } from "@/features/listens/utils";
import ArtistInfo from "./ArtistInfo";
import ArtistSortDropdown from "./ArtistSortDropdown";
import ArtistTracks from "./ArtistTracks";
import { RecentListensDisplay } from "@/features/listens/components/RecentListensDisplay";
import { MediaItemWithCount } from "@/features/listens/types";

export const ArtistPage = () => {
  const { artistId } = useParams();
  const songPlays = useMediaPlays(artistId!, "artist");
  const [sortMethod, setSortMethod] = useState("by-count");
  const [songCounts, setSongCounts] = useState<MediaItemWithCount[]>([]);

  useEffect(() => {
    const getSongCounts = async () => {
      const counts = await countItems(songPlays, "track_name");
      setSongCounts(counts);
    };
    getSongCounts();
  }, [songPlays]);

  const handleSortChange = (event: React.ChangeEvent<{ value: string }>) => {
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
        artistId={artistId!}
      />
      <RecentListensDisplay
        data={songPlays}
        dataLength={songPlays.length}
        ItemComponent={ListenComponent}
        title={"Recent Listens"}
        totalLabel={"Listens"}
      />
    </>
  );
};
