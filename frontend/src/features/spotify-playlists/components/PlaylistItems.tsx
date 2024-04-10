import { SpotifyLink } from "@/features/listens/components/SpotifyLink";
import React from "react";
import { Link } from "react-router-dom";

export const PlaylistItems: React.FC<{
  item: SpotifyApi.PlaylistObjectSimplified;
}> = ({ item }) => {
  return (
    <div key={item.id} className="mx-auto flex w-2/5 justify-between">
      <div className="flex">
        <SpotifyLink url={item.external_urls.spotify} />
        <Link
          to={`${item.uri.split(":")[2]}`}
          className="ml-1 hover:bg-violet-400"
        >
          {item.name}
        </Link>
      </div>
      <div>{item.tracks.total}</div>
    </div>
  );
};
