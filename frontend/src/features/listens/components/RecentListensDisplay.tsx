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
      <h1 className="my-2 text-xl font-bold">{title}</h1>
      <p className="mb-1 text-lg font-semibold">
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
