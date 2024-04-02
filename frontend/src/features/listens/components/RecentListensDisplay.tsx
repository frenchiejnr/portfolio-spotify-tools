import Pagination from "@/components/Pagination";
import React from "react";

interface RecentListensProps<T> {
  data: T[];
  isLoading: boolean;
  dataLength: number;
  ItemComponent: React.FC<T>;
  title: string;
  totalLabel: string;
}
export const RecentListensDisplay = (props: RecentListensProps<T>) => {
  const { data, isLoading, dataLength, ItemComponent, title, totalLabel } =
    props;

  return (
    <>
      {isLoading ? (
        <p>Loading {title}</p>
      ) : (
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
      )}
    </>
  );
};
