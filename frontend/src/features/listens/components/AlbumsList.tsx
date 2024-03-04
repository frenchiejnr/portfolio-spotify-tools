import { getListOfAlbums } from "../utils";
import { DataList } from "./DataList";

export const AlbumsList = () => {
  return <DataList getData={getListOfAlbums} title="Albums" />;
};
