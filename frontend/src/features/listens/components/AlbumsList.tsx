import { getListOfAlbums } from "..";
import { DataList } from "./DataList";

export const AlbumsList = () => {
  return <DataList getData={getListOfAlbums} title="Albums" />;
};
