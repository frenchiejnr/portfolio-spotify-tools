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
        className={`mt-1 flex w-full basis-1/12 justify-between rounded-xl p-2
        ${props.bgColour ? props.bgColour : "bg-indigo-200"}
        `}
      >
        <button
          onClick={() => setShowTracks((prevShowTracks) => !prevShowTracks)}
        >
          {showTracks ? <UpIcon /> : <DownIcon />}
        </button>
        <div className="md:flex-grow">
          <h1 className="text-right text-xl font-bold md:text-center">
            {title}
          </h1>
          <p className="text-right text-lg font-semibold md:text-center">
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
