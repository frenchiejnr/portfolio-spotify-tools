import { useMediaInfo } from "@/hooks/useMediaInfo";
import { useMediaPlays } from "@/hooks/useMediaPlays";
import { useParams } from "react-router-dom";

const ArtistInfo = () => {
  const { artistId } = useParams();
  const { mediaInfo, isLoading } = useMediaInfo(artistId!, "artist");
  const songPlays = useMediaPlays(artistId!, "artist");

  return (
    <>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <>
          <div>
            {mediaInfo?.name} - {songPlays?.length} Plays
          </div>
        </>
      )}
    </>
  );
};

export default ArtistInfo;
