import React from "react";
import { SpotifyLink } from "./SpotifyLink";
import { Link } from "react-router-dom";

export const ListComponent: React.FC<{
  item: any;
}> = ({ item }) => (
  <div key={item} className="flex w-2/5 justify-between mx-auto">
    <div className="flex">
      <SpotifyLink url={item.url} />
      <Link to="" target="" className="hover:text-violet-400 ml-1">
        <p>{item.name}</p>
      </Link>
    </div>
    <p>{item.count}</p>
  </div>
);
