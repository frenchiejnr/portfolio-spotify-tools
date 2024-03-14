import { SpotifyLink } from "@/features/listens/components/SpotifyLink";
import React from "react";

export const PlaylistTracks: React.FC<{
  item: SpotifyApi.PlaylistTrackObject;
  songCounts: { [key: string]: number };
}> = ({ item, songCounts }) => {
  const songId = item.track?.id;
  const listenCount = songCounts[songId] || 0;
  return (
    <div key={item.track?.id} className="flex w-4/5 justify-between mx-auto">
      <div className="hover:bg-violet-400 ml-1 basis-1/4 flex">
        <SpotifyLink url={item.track?.external_urls.spotify} />
        <p>{item.track?.name}</p>
      </div>
      <div className="hover:bg-violet-400 ml-1 basis-1/4 flex">
        <SpotifyLink url={item.track?.artists[0].external_urls.spotify} />
        <p>{item.track?.artists[0].name}</p>
      </div>
      <div className="hover:bg-violet-400 ml-1 basis-1/4 flex">
        <SpotifyLink url={item.track?.album.external_urls.spotify} />
        <p>{item.track?.album.name}</p>
      </div>
      {/* TODO: Number of times track listened to */}
      <div className="ml-1 basis-1/4">
        <p>{listenCount}</p>
      </div>
    </div>
  );
};
