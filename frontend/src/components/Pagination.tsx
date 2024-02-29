import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  totalCount: number;
  pageSize: number;

  data: [];
}

const Pagination: React.FC<PaginationProps> = ({
  totalCount,
  pageSize,
  data,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = pageSize;

  useEffect(() => {
    setTotalPages(Math.ceil(totalCount / itemsPerPage));
  }, [data]);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const subset = data.slice(startIndex, endIndex);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <div>
      {subset.map((item) => (
        <div key={item}>
          {item[0]} {item[1]}
        </div>
      ))}
      <div className="flex justify-center mt-4">
        <ReactPaginate
          pageCount={totalPages}
          onPageChange={handlePageChange}
          className="pagination flex list-none rounded-md shadow"
          activeClassName="active bg-gray-200 text-gray-700"
          previousLinkClassName="prev px-2 py-1 rounded-md hover:bg-gray-100"
          nextLinkClassName="next px-2 py-1 rounded-md hover:bg-gray-100"
          pageLinkClassName="page-link px-2 py-1 hover:bg-gray-100"
        />
      </div>
    </div>
  );
};

export default Pagination;
