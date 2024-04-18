import { useParams } from "react-router-dom";
import ArtistTracks from "./ArtistTracks";
import MediaPage from "./MediaPage";
import ArtistAlbums from "./ArtistAlbums";

export const ArtistPage = () => {
  const { artistId } = useParams();
  return (
    <MediaPage
      mediaId={artistId}
      mediaType={"artist"}
      renderTracks={(props) => <ArtistTracks {...props} artistId={artistId} />}
      renderAlbums={(props) => <ArtistAlbums {...props} artistId={artistId} />}
    />
  );
};
