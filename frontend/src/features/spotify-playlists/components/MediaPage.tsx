import { MediaItemWithCount } from "@/features/listens/types";
import { countItems } from "@/features/listens/utils";
import { useMediaPlays } from "@/hooks/useMediaPlays";
import React, { useEffect, useState } from "react";
import MediaInfo from "./MediaInfo";
import MediaSortDropdown from "./MediaSortDropdown";
import { RecentListensDisplay } from "@/features/listens/components/RecentListensDisplay";
import { ListenComponent } from "@/features/listens/components/Listen";
import { LinkBar } from "@/components/LinkBar";

export const MediaPage = ({
  mediaId,
  mediaType,
  renderTracks,
  renderAlbums = null,
}: {
  mediaId: string;
  mediaType: "track" | "artist" | "album";
  renderTracks: any;
  renderAlbums?: any;
}) => {
  const songPlays = useMediaPlays(mediaId!, mediaType);
  const [sortMethod, setSortMethod] = useState("by-count");
  const [showTracks, setShowTracks] = useState(true);
  const [albumCounts, setAlbumCounts] = useState<MediaItemWithCount[]>([]);
  const [songCounts, setSongCounts] = useState<MediaItemWithCount[]>([]);

  useEffect(() => {
    const getSongCounts = async () => {
      const counts = await countItems(songPlays, "track_name");
      setSongCounts(counts);
    };

    getSongCounts();
  }, [songPlays]);

  useEffect(() => {
    const getAlbumCount = async () => {
      if (renderAlbums) {
        const counts = await countItems(songPlays, "release_name");
        setAlbumCounts(counts);
      }
    };

    getAlbumCount();
  }, [songPlays]);

  const handleSortChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSortMethod(event.target.value);
  };

  const handleShowTracksChange = () => {
    setShowTracks((prevShowTracks) => !prevShowTracks);
  };

  return (
    <>
      <LinkBar />
      <div className="m-auto flex h-dvh w-5/6 flex-col">
        <MediaInfo
          id={mediaId!}
          mediaType={mediaType}
          handleShowTracksChange={handleShowTracksChange}
          showTracks={showTracks}
        />
        {showTracks && (
          <MediaSortDropdown
            sortMethod={sortMethod}
            handleSortChange={handleSortChange}
          />
        )}
        {showTracks && renderTracks({ sortMethod, songCounts, mediaId })}
        <hr />
        {showTracks &&
          renderAlbums &&
          renderAlbums({ sortMethod, albumCounts, mediaId })}
        <RecentListensDisplay
          data={songPlays}
          dataLength={songPlays.length}
          ItemComponent={ListenComponent}
          title={"Recent Listens"}
          totalLabel={"Listens"}
        />
      </div>
    </>
  );
};

export default MediaPage;
