import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";

export const DataList = ({ getData, title }) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await getData();
      setData(() => response);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const sortedData = Object.entries(data).sort(
    ([keyA, valueA], [keyB, valueB]) => valueB - valueA,
  );

  return (
    <div>
      {isLoading ? (
        <p>Loading {title}</p>
      ) : (
        <>
          <h1>{title} List</h1>
          <p>
            Total {title} {Object.keys(data).length}
          </p>
          <Pagination
            totalCount={Object.keys(data).length}
            pageSize={10}
            data={sortedData}
          />
        </>
      )}
    </div>
  );
};
