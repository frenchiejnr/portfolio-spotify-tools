import React from "react";
import { SpotifyLink } from "./SpotifyLink";
import { Link } from "react-router-dom";
import { getItemUrl } from "../utils";

export const ListComponent: React.FC<{
  item: any;
}> = ({ item }) => {
  const url = getItemUrl(item);
  return (
    <div
      key={item}
      className="mx-auto flex w-full flex-1 items-center justify-between"
    >
      <div className="flex">
        <SpotifyLink url={item.url} />
        <Link
          to={url?.[0]}
          target=""
          className="flex items-center hover:font-medium hover:text-violet-400"
        >
          <p className="tex px-4 text-left">{item.name}</p>
        </Link>
      </div>
      <p className="">{item.count}</p>
    </div>
  );
};
