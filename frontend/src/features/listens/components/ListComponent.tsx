import React from "react";

export const ListComponent: React.FC<{
  item: any;
}> = ({ item }) => (
  <div key={item} className="flex w-2/5 justify-between mx-auto">
    <p>{item[0]}</p>
    <p>{item[1]}</p>
  </div>
);
