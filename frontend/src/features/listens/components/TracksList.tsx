import { getListOfTracks } from "..";
import { DataList } from "./DataList";

export const TracksList = () => {
  return <DataList getData={getListOfTracks} title="Tracks" />;
};
