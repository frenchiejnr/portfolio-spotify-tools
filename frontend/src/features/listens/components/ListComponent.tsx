import React from "react";
import { SpotifyLink } from "./SpotifyLink";

export const ListComponent: React.FC<{
  item: any;
}> = ({ item }) => (
  <div key={item} className="flex w-2/5 justify-between mx-auto">
    <div className="flex">
      <SpotifyLink url={item.url} />
      <a href="" target="_blank" className="hover:bg-violet-400 ml-1">
        <p>{item.name}</p>
      </a>
    </div>
    <p>{item.count}</p>
  </div>
);
