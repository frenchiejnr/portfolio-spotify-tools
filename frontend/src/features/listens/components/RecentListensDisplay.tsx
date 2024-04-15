import Pagination from "@/components/Pagination";
import React, { useState } from "react";
import { Listen } from "../types";
import {
  DownIcon,
  UpIcon,
} from "@/features/spotify-playlists/components/Icons";

interface RecentListensProps<T> {
  data: T[];
  dataLength: number;
  ItemComponent: React.FC<T>;
  title: string;
  totalLabel: string;
  bgColour?: string;
}
export const RecentListensDisplay = (props: RecentListensProps<Listen>) => {
  const { data, dataLength, ItemComponent, title, totalLabel } = props;
  const [showTracks, setShowTracks] = useState(true);

  return (
    <>
      <div
        className={`mt-1 w-full basis-1/12 rounded-xl ${props.bgColour ? props.bgColour : "bg-indigo-200"} flex justify-between p-2`}
      >
        <button
          onClick={() => setShowTracks((prevShowTracks) => !prevShowTracks)}
        >
          {showTracks ? <UpIcon /> : <DownIcon />}
        </button>
        <div>
          <h1 className="text-right text-xl font-bold">{title}</h1>
          <p className="text-right text-lg font-semibold">
            {totalLabel} - {dataLength}
          </p>
        </div>
      </div>
      {showTracks && (
        <div className="basis-11/12">
          <Pagination
            totalCount={dataLength}
            pageSize={10}
            data={data}
            ItemComponent={ItemComponent}
          />
        </div>
      )}
    </>
  );
};
