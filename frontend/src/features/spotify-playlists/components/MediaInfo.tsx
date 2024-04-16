import { useMediaInfo } from "@/hooks/useMediaInfo";
import { useMediaPlays } from "@/hooks/useMediaPlays";
import { DownIcon, UpIcon } from "./Icons";

const MediaInfo = ({
  id,
  mediaType,
  handleShowTracksChange,
  showTracks,
}: {
  id: string;
  mediaType: "track" | "album" | "artist";
  handleShowTracksChange: any;
  showTracks: boolean;
}) => {
  const { mediaInfo, isLoading } = useMediaInfo(id, mediaType);
  const songPlays = useMediaPlays(id, mediaType);

  return (
    <>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <div className="mt-1 flex w-full basis-1/12 justify-between rounded-xl bg-indigo-200 p-2 text-right">
          <button onClick={handleShowTracksChange}>
            {showTracks ? <UpIcon /> : <DownIcon />}
          </button>
          <div className="flex-grow">
            <p className="text-xl font-bold  md:text-center">
              {mediaInfo?.name}
            </p>
            <p className="semi-bold text-lg  md:text-center">
              {songPlays?.length} Plays
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default MediaInfo;
