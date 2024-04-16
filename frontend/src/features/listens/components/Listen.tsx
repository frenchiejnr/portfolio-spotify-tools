import { Link } from "react-router-dom";
import { Listen } from "../types";
import { SpotifyLink } from "./SpotifyLink";
import { getItemUrl } from "../utils";
import { MultipleArtists } from "./MultipleArtists";
import {
  AlbumIcon,
  ArtistIcon,
  TrackIcon,
} from "@/features/spotify-playlists/components/Icons";

export const InternalLink = ({ url, text }: { url: string; text: string }) => (
  <Link
    to={url || null}
    className="pl-1 hover:font-medium hover:text-violet-400"
  >
    {text}
  </Link>
);

const SingleArtist: React.FC<{
  artist_item_url: string;
  item: Listen;
}> = ({ artist_item_url, item }) => (
  <div className="flex md:basis-1/3">
    <SpotifyLink
      url={
        item.track_metadata.additional_info.spotify_album_artist_ids?.[0] ||
        null
      }
    />{" "}
    <div className="flex flex-row">
      <ArtistIcon />
      <InternalLink
        url={artist_item_url}
        text={item.track_metadata.artist_name}
      />
    </div>
  </div>
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
      <div className="mx-auto flex w-full flex-row items-start justify-between md:flex-row">
        <div className="flex flex-grow basis-3/4 flex-col text-left md:basis-5/6 md:flex-row md:items-center">
          <div className="flex md:basis-1/3 md:pr-1">
            <SpotifyLink url={item.track_metadata.additional_info.origin_url} />
            <div className="flex flex-row ">
              <TrackIcon />
              <InternalLink
                url={track_item_url}
                text={item.track_metadata.track_name}
              />
            </div>
          </div>
          {item.track_metadata.additional_info.artist_names?.length === 1 ? (
            <SingleArtist artist_item_url={artist_item_url} item={item} />
          ) : (
            <MultipleArtists artist_item_url={"1"} item={item} />
          )}
          <div className="flex md:basis-1/3 md:pr-1">
            <SpotifyLink
              url={item.track_metadata.additional_info.spotify_album_id}
            />{" "}
            <div className="flex flex-row">
              <AlbumIcon />
              <InternalLink
                url={album_item_url}
                text={item.track_metadata.release_name}
              />
            </div>
          </div>
        </div>
        <p className="basis-1/4 self-center text-xs md:basis-1/5">
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
      <hr />
    </>
  );
};
