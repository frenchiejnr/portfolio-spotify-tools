import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import { ListComponent } from "./ListComponent";

export const DataList = ({ getData, title }: { getData: any; title: any }) => {
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

  const sortedData = Object.entries<any>(data).sort(
    ([, valueA]: [string, number], [, valueB]: [string, number]) =>
      valueB - valueA,
  );

  return (
    <div>
      {isLoading ? (
        <p>Loading {title}</p>
      ) : (
        <>
          <h1 className="text-xl font-bold my-2">{title} List</h1>
          <p className="text-lg font-semibold mb-1">
            Total {title} - {Object.keys(data).length}
          </p>
          <Pagination
            totalCount={Object.keys(data).length}
            pageSize={10}
            data={sortedData}
            ItemComponent={ListComponent}
          />
        </>
      )}
    </div>
  );
};
