import Pagination from "@/components/Pagination";
import { ListenComponent } from "@/features/listens/components/Listen";
import { useMediaPlays } from "@/hooks/useMediaPlays";
import { useMediaInfo } from "@/hooks/useMediaInfo";

import { useParams } from "react-router-dom";

export const ArtistPage = () => {
  const { artistId } = useParams();

  const { mediaInfo, isLoading } = useMediaInfo(artistId, "artist");
  const songPlays = useMediaPlays(artistId, "artist");

  return (
    <>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <>
          <div>
            {mediaInfo?.name} - {songPlays?.length} Plays
          </div>
          <Pagination
            totalCount={songPlays?.length}
            pageSize={10}
            data={songPlays}
            ItemComponent={ListenComponent}
          />
        </>
      )}
    </>
  );
};
