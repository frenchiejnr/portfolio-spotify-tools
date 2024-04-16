import { SpotifyLink } from "@/features/listens/components/SpotifyLink";
import React from "react";
import { Link } from "react-router-dom";

export const PlaylistItems: React.FC<{
  item: SpotifyApi.PlaylistObjectSimplified;
}> = ({ item }) => {
  return (
    <div
      key={item.id}
      className="mx-auto flex w-full flex-1 items-center justify-between"
    >
      <div className="flex">
        <SpotifyLink url={item.external_urls.spotify} />
        <Link
          to={`${item.uri.split(":")[2]}`}
          className="flex items-center hover:font-medium hover:text-violet-400"
        >
          <p className="px-4 text-left">{item.name}</p>
        </Link>
      </div>
      <p className="font-semibold">{item.tracks.total}</p>
    </div>
  );
};
