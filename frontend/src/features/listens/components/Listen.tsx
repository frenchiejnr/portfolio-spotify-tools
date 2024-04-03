import { Link } from "react-router-dom";
import { Listen } from "../types";
import { SpotifyLink } from "./SpotifyLink";
import { getItemUrl } from "../utils";

export const InternalLink = ({ url, text }) => (
  <Link to={url || null} className="hover:bg-violet-400 pl-1">
    {text}
  </Link>
);

export const ListenComponent: React.FC<{ item: Listen }> = ({
  item,
}: {
  item: Listen;
}) => {
  const track_item_url = getItemUrl(
    item,
    "track_metadata.additional_info.origin_url",
  )?.[0];
  const artist_item_url = getItemUrl(
    item,
    "track_metadata.additional_info.spotify_album_artist_ids",
  )?.[0];
  const album_item_url = getItemUrl(
    item,
    "track_metadata.additional_info.spotify_album_id",
  )?.[0];

  return (
    <div className="flex w-4/5 justify-between mx-auto">
      <p className="basis-1/4 flex">
        <SpotifyLink url={item.track_metadata.additional_info.origin_url} />
        <InternalLink
          url={track_item_url}
          text={item.track_metadata.track_name}
        />
      </p>
      <p className="basis-1/4 flex">
        <SpotifyLink
          url={
            item.track_metadata.additional_info.spotify_album_artist_ids?.[0] ||
            null
          }
        />
        <InternalLink
          url={artist_item_url}
          text={item.track_metadata.artist_name}
        />
      </p>
      <p className="basis-1/4 flex">
        <SpotifyLink
          url={item.track_metadata.additional_info.spotify_album_id}
        />
        <InternalLink
          url={album_item_url}
          text={item.track_metadata.release_name}
        />
      </p>
      <p className="basis-1/8">
        {new Intl.DateTimeFormat("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        }).format(item.listened_at * 1000)}
      </p>
    </div>
  );
};
