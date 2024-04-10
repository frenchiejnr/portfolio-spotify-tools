import { Link } from "react-router-dom";
import { Listen } from "../types";
import { SpotifyLink } from "./SpotifyLink";
import { getItemUrl } from "../utils";
import { MultipleArtists } from "./MultipleArtists";

export const InternalLink = ({ url, text }: { url: string; text: string }) => (
  <Link
    to={url || null}
    className="pl-4 hover:font-medium hover:text-violet-400"
  >
    {text}
  </Link>
);

const SingleArtist: React.FC<{
  artist_item_url: string;
  item: Listen;
}> = ({ artist_item_url, item }) => (
  <p className="flex">
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
    <>
      <div className="mx-auto flex w-full flex-row items-start justify-between sm:flex-row">
        <div className="flex flex-grow basis-3/4 flex-col text-left sm:basis-5/6 sm:flex-row">
          <p className="flex sm:basis-1/4">
            <SpotifyLink url={item.track_metadata.additional_info.origin_url} />
            <InternalLink
              url={track_item_url}
              text={item.track_metadata.track_name}
            />
          </p>
          {item.track_metadata.additional_info.artist_names?.length === 1 ? (
            <SingleArtist artist_item_url={artist_item_url} item={item} />
          ) : (
            <MultipleArtists artist_item_url={"1"} item={item} />
          )}
          <p className="flex sm:basis-1/4">
            <SpotifyLink
              url={item.track_metadata.additional_info.spotify_album_id}
            />
            <InternalLink
              url={album_item_url}
              text={item.track_metadata.release_name}
            />
          </p>
        </div>
        <p className="basis-1/4 text-xs sm:basis-1/6 sm:text-base">
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
      <hr className="sm:hidden" />
    </>
  );
};
