import { Link } from "react-router-dom";
import { Listen } from "../types";
import { SpotifyLink } from "./SpotifyLink";

export const ListenComponent: React.FC<{ item: Listen }> = ({
  item,
}: {
  item: Listen;
}) => {
  const track_id = item?.track_metadata?.additional_info?.origin_url?.split(
    "/track/",
  )[1]
    ? `/track/${item.track_metadata.additional_info.origin_url.split("/track/")[1]}`
    : "#";
  return (
    <div className="flex w-4/5 justify-between mx-auto">
      <p className="basis-1/4 flex">
        <SpotifyLink url={item.track_metadata.additional_info.origin_url} />
        <Link to={track_id} target="" className="hover:bg-violet-400 pl-1">
          {item.track_metadata.track_name}
        </Link>
      </p>
      <p className="basis-1/4 flex">
        <SpotifyLink
          url={
            item.track_metadata.additional_info.spotify_album_artist_ids?.[0] ||
            null
          }
        />
        <Link to={""} target={""} className="hover:bg-violet-400 pl-1">
          {item.track_metadata.artist_name}
        </Link>
      </p>
      <p className="basis-1/4 flex">
        <SpotifyLink
          url={item.track_metadata.additional_info.spotify_album_id}
        />
        <Link to={""} target="" className="hover:bg-violet-400 pl-1">
          {item.track_metadata.release_name}
        </Link>
      </p>
      <p className="basis-1/8">
        {new Date(item.listened_at * 1000).toUTCString()}
      </p>
    </div>
  );
};
