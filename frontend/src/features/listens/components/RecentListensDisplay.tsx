import Pagination from "@/components/Pagination";
import React from "react";
import { Listen } from "../types";

interface RecentListensProps<T> {
  data: T[];
  dataLength: number;
  ItemComponent: React.FC<T>;
  title: string;
  totalLabel: string;
}
export const RecentListensDisplay = (props: RecentListensProps<Listen>) => {
  const { data, dataLength, ItemComponent, title, totalLabel } = props;

  return (
    <>
      <h1 className="text-xl font-bold my-2">{title}</h1>
      <p className="text-lg font-semibold mb-1">
        {totalLabel} - {dataLength}
      </p>
      <Pagination
        totalCount={dataLength}
        pageSize={10}
        data={data}
        ItemComponent={ItemComponent}
      />
    </>
  );
};
