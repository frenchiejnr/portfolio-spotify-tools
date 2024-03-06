import { getListOfAlbums } from "../utils";
import { DataList } from "./DataList";

export const AlbumsList = ({ refresh }: { refresh: boolean }) => {
  return (
    <DataList getData={getListOfAlbums} title="Albums" refresh={refresh} />
  );
};
