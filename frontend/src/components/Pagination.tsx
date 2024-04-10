import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  totalCount: number;
  pageSize: number;
  data: any[];
  ItemComponent: React.FC<{ item: any; songCounts?: any }>;
  songCounts?: {};
}

const Pagination: React.FC<PaginationProps> = ({
  totalCount,
  pageSize,
  data,
  ItemComponent,
  songCounts,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  useEffect(() => {
    setTotalPages(Math.ceil(totalCount / pageSize));
  }, [data]);

  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const subset = data?.slice(startIndex, endIndex);

  const handlePageChange = (selectedPage: any) => {
    setTotalPages(Math.ceil(totalCount / pageSize));
    setCurrentPage(selectedPage.selected);
  };
  return (
    <div className="flex h-full w-full flex-grow flex-col text-center">
      <div className="flex h-full flex-grow basis-11/12 flex-col">
        {subset.map((item) => {
          item.keyid = uuidv4();
          return (
            <ItemComponent
              key={item.keyid}
              item={item}
              songCounts={songCounts}
            />
          );
        })}
      </div>
      <div className="mb-1 flex basis-1/12 justify-center rounded-xl bg-indigo-200 p-1">
        <ReactPaginate
          pageCount={totalPages}
          onPageChange={handlePageChange}
          className=" flex w-full list-none items-center justify-between space-x-1 rounded-md "
          activeClassName="active bg-gray-200 text-gray-700 rounded-md "
          previousLinkClassName="prev px-2 py-1 rounded-md  shadow bg-gray-200 hover:bg-gray-100"
          nextLinkClassName="next px-2 py-1 rounded-md shadow bg-gray-200  hover:bg-gray-100"
          pageLinkClassName="page-link px-2 py-1 rounded-md hover:bg-gray-100"
          pageRangeDisplayed={0}
          marginPagesDisplayed={1}
          previousLabel={"<"}
          nextLabel={">"}
        />
      </div>
    </div>
  );
};

export default Pagination;
