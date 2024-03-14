import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useReducer, useState } from "react";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  totalCount: number;
  pageSize: number;
  data: any[];
  ItemComponent: React.FC<{ item: any }>;
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
  const itemsPerPage = pageSize;
  useEffect(() => {
    setTotalPages(Math.ceil(totalCount / itemsPerPage));
  }, [data]);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const subset = data?.slice(startIndex, endIndex);

  const handlePageChange = (selectedPage: any) => {
    setTotalPages(Math.ceil(totalCount / itemsPerPage));
    setCurrentPage(selectedPage.selected);
  };

  return (
    <div className="text-center">
      {subset.map((item) => {
        item.id = uuidv4();
        return (
          <ItemComponent key={item.id} item={item} songCounts={songCounts} />
        );
      })}
      <div className="flex justify-center mt-4">
        <ReactPaginate
          pageCount={totalPages}
          onPageChange={handlePageChange}
          className="pagination flex list-none rounded-md space-x-1"
          activeClassName="active bg-gray-200 text-gray-700 rounded-md "
          previousLinkClassName="prev px-2 py-1 rounded-md hover:bg-gray-100 shadow"
          nextLinkClassName="next px-2 py-1 rounded-md hover:bg-gray-100 shadow"
          pageLinkClassName="page-link px-2 py-1 hover:bg-gray-100 rounded-md"
        />
      </div>
    </div>
  );
};

export default Pagination;
