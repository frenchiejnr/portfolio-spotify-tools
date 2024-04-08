import Pagination from "@/components/Pagination";
import { ListenComponent } from "@/features/listens/components/Listen";
import { useMediaPlays } from "@/hooks/useMediaPlays";
import { useMediaInfo } from "@/hooks/useMediaInfo";

import { useParams } from "react-router-dom";

export const TrackPage = () => {
  const { trackId } = useParams();

  const { mediaInfo, isLoading } = useMediaInfo(trackId, "track");
  const songPlays = useMediaPlays(trackId, "track");

  return (
    <>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <>
          <div>
            {mediaInfo?.name} - {mediaInfo?.album.name} -{" "}
            {mediaInfo?.artists?.map((artist) => artist.name).join(", ")}
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
