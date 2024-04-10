import { MediaItemWithCount } from "@/features/listens/types";
import { countItems } from "@/features/listens/utils";
import { useMediaPlays } from "@/hooks/useMediaPlays";
import React, { useEffect, useState } from "react";
import MediaInfo from "./MediaInfo";
import MediaSortDropdown from "./MediaSortDropdown";
import { RecentListensDisplay } from "@/features/listens/components/RecentListensDisplay";
import { ListenComponent } from "@/features/listens/components/Listen";

export const MediaPage = ({
  mediaId,
  mediaType,
  renderTracks,
}: {
  mediaId: string;
  mediaType: "track" | "artist" | "album";
  renderTracks: any;
}) => {
  const songPlays = useMediaPlays(mediaId!, mediaType);
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
    <div className="m-auto flex h-dvh w-5/6 flex-col">
      <MediaInfo id={mediaId!} mediaType={mediaType} />
      <MediaSortDropdown
        sortMethod={sortMethod}
        handleSortChange={handleSortChange}
      />
      {renderTracks({ sortMethod, songCounts, mediaId })}
      <hr />
      <RecentListensDisplay
        data={songPlays}
        dataLength={songPlays.length}
        ItemComponent={ListenComponent}
        title={"Recent Listens"}
        totalLabel={"Listens"}
      />
    </div>
  );
};

export default MediaPage;
