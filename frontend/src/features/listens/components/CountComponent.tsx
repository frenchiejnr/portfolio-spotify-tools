import { Link } from "react-router-dom";
import { getItemUrl } from "../utils";
import { SpotifyLink } from "./SpotifyLink";
import { useEffect, useState } from "react";
import { PlayIcon } from "@/features/spotify-playlists/components/Icons";

export const CountComponent: React.FC<{
  item: any;
  songCounts: any;
}> = ({ item, songCounts }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const fetchCount = async () => {
      setCount(
        songCounts.filter(
          (song: any) => song.id === item.external_urls.spotify,
        )[0]?.count || 0,
      );
    };
    fetchCount();
  }, []);

  const url = getItemUrl(item, "external_urls.spotify");
  return (
    <div
      key={item}
      className="mx-auto flex w-full flex-1 items-center justify-between"
    >
      <div className="flex">
        <SpotifyLink url={item.external_urls.spotify} />
        <Link
          to={url?.[0]!}
          target=""
          className="flex items-center hover:font-medium hover:text-violet-400"
        >
          <p className="px-4 text-left">{item.name}</p>
        </Link>
      </div>
      <div className="flex flex-row">
        <PlayIcon />
        <p className="font-semibold">{count}</p>
      </div>
    </div>
  );
};
