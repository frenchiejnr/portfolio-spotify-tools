import Pagination from "@/components/Pagination";
import { ListenComponent } from "@/features/listens/components/Listen";
import { useSongPlays } from "@/hooks/useSongPlays";
import { useTrackInfo } from "@/hooks/useTrackInfo";

import { useParams } from "react-router-dom";

export const TrackPage = () => {
  const { trackId } = useParams();

  const { trackInfo, isLoading } = useTrackInfo(trackId);
  const songPlays = useSongPlays(trackId);

  return (
    <>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <>
          <div>
            {trackInfo?.name} - {trackInfo?.album.name} -{" "}
            {trackInfo?.artists?.map((artist) => artist.name).join(", ")}
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
