import { SpotifyLink } from "@/features/listens/components/SpotifyLink";
import React from "react";
import { Link } from "react-router-dom";
import { TrackIcon, ArtistIcon, AlbumIcon, PlayIcon } from "./Icons";

export const PlaylistTracks: React.FC<{
  item: SpotifyApi.PlaylistTrackObject;
  songCounts: { [key: string]: number };
}> = ({ item, songCounts }) => {
  const songId = item.track?.id;
  const listenCount = songCounts[songId] || 0;
  return (
    <>
      <div
        key={item.track?.id}
        className="mx-auto flex w-full flex-1 items-center justify-between md:flex-row"
      >
        <div className="flex flex-grow basis-3/4 flex-col text-left sm:basis-5/6 md:flex-row md:items-center">
          <div className="flex md:basis-1/3">
            <SpotifyLink url={item.track?.external_urls.spotify} />
            <Link
              to={`/track/${item.track?.id}`}
              className="flex items-center hover:font-medium hover:text-violet-400"
            >
              {" "}
              <div className="flex flex-row">
                <TrackIcon />
                <p className="px-1 text-left">{item.track?.name}</p>
              </div>
            </Link>
          </div>
          <div className="flex md:basis-1/3">
            <SpotifyLink url={item.track?.artists[0].external_urls.spotify} />
            <Link
              to={`/artist/${item.track?.artists[0].id}`}
              className="flex items-center hover:font-medium hover:text-violet-400"
            >
              {" "}
              <div className="flex flex-row">
                <ArtistIcon />
                <p className="px-1">{item.track?.artists[0].name}</p>
              </div>
            </Link>
          </div>
          <div className="flex md:basis-1/3">
            <SpotifyLink url={item.track?.album.external_urls.spotify} />
            <Link
              to={`/album/${item.track?.album.id}`}
              className="flex items-center hover:font-medium hover:text-violet-400"
            >
              <div className="flex flex-row">
                <AlbumIcon />
                <p className="px-1 text-left">{item.track?.album.name}</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="basis-1/4 self-center md:basis-1/12">
          <div className="flex flex-row justify-end">
            <PlayIcon />
            <p className="pl-1">{listenCount}</p>
          </div>
        </div>
      </div>
      <hr />
    </>
  );
};
