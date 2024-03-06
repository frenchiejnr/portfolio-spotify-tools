import { getListOfTracks } from "../utils";
import { DataList } from "./DataList";

export const TracksList = ({ refresh }: { refresh: boolean }) => {
  return (
    <DataList getData={getListOfTracks} title="Tracks" refresh={refresh} />
  );
};
