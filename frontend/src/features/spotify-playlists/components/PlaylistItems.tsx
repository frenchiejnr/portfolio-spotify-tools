import { SpotifyLink } from "@/features/listens/components/SpotifyLink";
import React from "react";
import { Link } from "react-router-dom";

export const PlaylistItems: React.FC<{
  item: SpotifyApi.PlaylistObjectSimplified;
}> = ({ item }) => {
  return (
    <div key={item.id} className="flex w-2/5 justify-between mx-auto">
      <div className="flex">
        <SpotifyLink url={item.external_urls.spotify} />
        <Link
          to={`${item.uri.split(":")[2]}`}
          className="hover:bg-violet-400 ml-1"
        >
          {item.name}
        </Link>
      </div>
      <div>{item.tracks.total}</div>
    </div>
  );
};
