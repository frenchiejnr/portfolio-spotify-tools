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
        <div className="mt-1 w-full flex-grow basis-1/12 rounded-xl bg-indigo-200 p-2">
          <p className="text-xl font-bold">{mediaInfo?.name}</p>
          <p className="semi-bold text-lg">{songPlays?.length} Plays</p>
        </div>
      )}
    </>
  );
};

export default MediaInfo;
