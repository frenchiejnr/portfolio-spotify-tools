import { ListenComponent } from "@/features/listens/components/Listen";
import { useMediaPlays } from "@/hooks/useMediaPlays";

import { useParams } from "react-router-dom";
import { RecentListensDisplay } from "@/features/listens/components/RecentListensDisplay";
import MediaInfo from "./ArtistInfo";
import AlbumTracks from "./AlbumTracks";
import { useEffect, useState } from "react";
import { MediaItemWithCount } from "@/features/listens/types";
import { countItems } from "@/features/listens/utils";
import MediaSortDropdown from "./MediaSortDropdown";

export const AlbumPage = () => {
  const { albumId } = useParams();
  const songPlays = useMediaPlays(albumId!, "album");
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
      <MediaInfo id={albumId!} mediaType={"album"} />
      <MediaSortDropdown
        sortMethod={sortMethod}
        handleSortChange={handleSortChange}
      />
      <AlbumTracks
        sortMethod={sortMethod}
        songCounts={songCounts}
        albumId={albumId!}
      />
      <RecentListensDisplay
        data={songPlays}
        dataLength={songPlays?.length}
        ItemComponent={ListenComponent}
        title={"Recent Listens"}
        totalLabel={"Listens"}
      />
    </>
  );
};
