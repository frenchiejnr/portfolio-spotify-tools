import { getListOfArtists } from "..";
import { DataList } from "./DataList";

export const ArtistsList = () => {
  return <DataList getData={getListOfArtists} title="Artists" />;
};
