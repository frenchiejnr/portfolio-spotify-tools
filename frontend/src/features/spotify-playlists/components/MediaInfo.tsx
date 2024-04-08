import { useMediaInfo } from "@/hooks/useMediaInfo";
import { useMediaPlays } from "@/hooks/useMediaPlays";

const MediaInfo = ({
  id,
  mediaType,
}: {
  id: string;
  mediaType: "track" | "album" | "artist";
}) => {
  const { mediaInfo, isLoading } = useMediaInfo(id, mediaType);
  const songPlays = useMediaPlays(id, mediaType);

  return (
    <>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <div>
          {mediaInfo?.name} - {songPlays?.length} Plays
        </div>
      )}
    </>
  );
};

export default MediaInfo;
