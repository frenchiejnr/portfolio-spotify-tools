import { SpotifyLink } from "@/features/listens/components/SpotifyLink";
import React from "react";

export const PlaylistTracks: React.FC<{
  item: SpotifyApi.PlaylistTrackObject;
}> = ({ item }) => (
  <div key={item.track?.id} className="flex w-2/5 justify-between mx-auto">
    <div className="flex">
      <SpotifyLink url={item.track?.external_urls.spotify} />
      <a href="" target="_blank" className="hover:bg-violet-400 ml-1">
        <p>{item.track?.name}</p>
      </a>
    </div>
  </div>
);
