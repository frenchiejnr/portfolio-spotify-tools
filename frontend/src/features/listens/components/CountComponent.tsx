import { Link } from "react-router-dom";
import { getItemUrl } from "../utils";
import { SpotifyLink } from "./SpotifyLink";
import { useEffect, useState } from "react";

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
    <div key={item} className="flex w-2/5 justify-between mx-auto">
      <div className="flex">
        <SpotifyLink url={item.external_urls.spotify} />
        <Link to={url?.[0]!} target="" className="hover:text-violet-400 ml-1">
          <p>{item.name}</p>
        </Link>
      </div>
      <p>{count}</p>
    </div>
  );
};