import Pagination from "@/components/Pagination";
import React from "react";
import { Listen } from "../types";

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

  return (
    <>
      <div
        className={`mt-1 w-full flex-grow basis-1/12 rounded-xl ${props.bgColour ? props.bgColour : "bg-indigo-200"} p-2`}
      >
        <h1 className="text-right text-xl font-bold">{title}</h1>
        <p className="text-right text-lg font-semibold">
          {totalLabel} - {dataLength}
        </p>
      </div>
      <div className="basis-11/12">
        <Pagination
          totalCount={dataLength}
          pageSize={10}
          data={data}
          ItemComponent={ItemComponent}
        />
      </div>
    </>
  );
};
