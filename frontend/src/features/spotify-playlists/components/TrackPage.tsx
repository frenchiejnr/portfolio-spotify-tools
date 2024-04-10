import Pagination from "@/components/Pagination";
import { ListenComponent } from "@/features/listens/components/Listen";
import { useMediaPlays } from "@/hooks/useMediaPlays";
import { useMediaInfo } from "@/hooks/useMediaInfo";

import { useParams } from "react-router-dom";
import { RecentListensDisplay } from "@/features/listens/components/RecentListensDisplay";

export const TrackPage = () => {
  const { trackId } = useParams();

  const { mediaInfo, isLoading } = useMediaInfo(trackId, "track");
  const songPlays = useMediaPlays(trackId, "track");

  return (
    <div className="m-auto flex h-dvh w-5/6 flex-col">
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <>
          <div className="mt-1 w-full flex-grow basis-1/12 rounded-xl bg-indigo-200 p-2 text-right">
            <p className="text-xl font-bold">{mediaInfo?.name}</p>
            <p className="semi-bold text-lg">{mediaInfo?.album.name}</p>
            <p>{mediaInfo?.artists?.map((artist) => artist.name).join(", ")}</p>
          </div>
          <RecentListensDisplay
            dataLength={songPlays?.length}
            pageSize={10}
            data={songPlays}
            ItemComponent={ListenComponent}
            title={`${mediaInfo?.name} Recent Listens`}
            totalLabel={"Plays"}
          />
        </>
      )}
    </div>
  );
};
