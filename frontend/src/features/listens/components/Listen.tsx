import { Listen } from "../types";

export const ListenComponent: React.FC<{ item: Listen }> = ({
  item,
}: {
  item: Listen;
}) => {
  return (
    <div className="flex w-4/5 justify-between mx-auto">
      <p className="basis-1/4">{item.track_metadata.track_name}</p>
      <p className="basis-1/4">{item.track_metadata.artist_name}</p>
      <p className="basis-1/4">{item.track_metadata.release_name}</p>
      <p className="basis-1/8">{item.listened_at}</p>
    </div>
  );
};
