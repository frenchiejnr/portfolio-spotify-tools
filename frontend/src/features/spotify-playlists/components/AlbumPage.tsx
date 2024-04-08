import { useParams } from "react-router-dom";
import AlbumTracks from "./AlbumTracks";
import MediaPage from "./MediaPage";

export const AlbumPage = () => {
  const { albumId } = useParams();
  return (
    <MediaPage
      mediaId={albumId}
      mediaType={"album"}
      renderTracks={(props) => <AlbumTracks {...props} albumId={albumId} />}
    />
  );
};
