import React from "react";
import { SpotifyLink } from "./SpotifyLink";
import { Link } from "react-router-dom";
import { getItemUrl } from "../utils";

export const ListComponent: React.FC<{
  item: any;
}> = ({ item }) => {
  const url = getItemUrl(item);
  return (
    <div key={item} className="flex w-2/5 justify-between mx-auto">
      <div className="flex">
        <SpotifyLink url={item.url} />
        <Link to={url?.[0]} target="" className="hover:bg-violet-400 ml-1">
          <p>{item.name}</p>
        </Link>
      </div>
      <p>{item.count}</p>
    </div>
  );
};
