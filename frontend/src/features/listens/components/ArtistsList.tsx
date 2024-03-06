import { getListOfArtists } from "../utils";
import { DataList } from "./DataList";

export const ArtistsList = ({ refresh }: { refresh: boolean }) => {
  return (
    <DataList getData={getListOfArtists} title="Artists" refresh={refresh} />
  );
};
