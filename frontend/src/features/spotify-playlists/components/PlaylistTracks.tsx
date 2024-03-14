import { SpotifyLink } from "@/features/listens/components/SpotifyLink";
import React from "react";
import { Link } from "react-router-dom";

export const PlaylistTracks: React.FC<{
  item: SpotifyApi.PlaylistTrackObject;
  songCounts: { [key: string]: number };
}> = ({ item, songCounts }) => {
  const songId = item.track?.id;
  const listenCount = songCounts[songId] || 0;
  return (
    <div key={item.track?.id} className="flex w-4/5 justify-between mx-auto">
      <div className=" ml-1 basis-1/4 flex">
        <SpotifyLink url={item.track?.external_urls.spotify} />
        <Link to={`/track/${item.track?.id}`} className="hover:text-violet-400">
          {item.track?.name}
        </Link>
      </div>
      <div className=" ml-1 basis-1/4 flex">
        <SpotifyLink url={item.track?.artists[0].external_urls.spotify} />
        <p className="hover:text-violet-400">{item.track?.artists[0].name}</p>
      </div>
      <div className=" ml-1 basis-1/4 flex">
        <SpotifyLink url={item.track?.album.external_urls.spotify} />
        <p className="hover:text-violet-400">{item.track?.album.name}</p>
      </div>
      {/* TODO: Number of times track listened to */}
      <div className="ml-1 basis-1/4">
        <p>{listenCount}</p>
      </div>
    </div>
  );
};
