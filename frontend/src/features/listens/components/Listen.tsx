import { Listen } from "../types";

export const ListenComponent: React.FC<{ item: Listen }> = ({
  item,
}: {
  item: Listen;
}) => {
  return (
    <div className="flex w-4/5 justify-between mx-auto">
      <p className="basis-1/4">
        <a
          href={`${item.track_metadata.additional_info.origin_url}`}
          target="_blank"
          className="hover:bg-violet-400"
        >
          {item.track_metadata.track_name}
        </a>
      </p>
      <p className="basis-1/4">
        <a
          href={`${item.track_metadata.additional_info.spotify_album_artist_ids[0]}`}
          target="_blank"
          className="hover:bg-violet-400"
        >
          {item.track_metadata.artist_name}
        </a>
      </p>
      <p className="basis-1/4">
        <a
          href={`${item.track_metadata.additional_info.spotify_album_id}`}
          target="_blank"
          className="hover:bg-violet-400"
        >
          {item.track_metadata.release_name}
        </a>
      </p>
      <p className="basis-1/8">
        {new Date(item.listened_at * 1000).toUTCString()}
      </p>
    </div>
  );
};
