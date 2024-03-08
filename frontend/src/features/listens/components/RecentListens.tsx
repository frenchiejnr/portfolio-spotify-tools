import Pagination from "@/components/Pagination";
import { getData } from "@/utils/indexDB";
import { useEffect, useState } from "react";
import { ListenComponent } from "./Listen";

export const RecentListens = ({ refresh }: { refresh: boolean }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log(`refreshing recent listens`);
      setIsLoading(true);
      const response = await getData("listens");
      setData(() => response);
      setIsLoading(false);
    };
    fetchData();
  }, [, refresh]);

  return (
    <>
      {isLoading ? (
        <p>Loading Recent Listens</p>
      ) : (
        <>
          <h1 className="text-xl font-bold my-2">Recent Listens</h1>
          <p className="text-lg font-semibold mb-1">
            Total Listens - {data?.length}
          </p>
          <Pagination
            totalCount={data?.length}
            pageSize={10}
            data={data}
            ItemComponent={ListenComponent}
          />
        </>
      )}
    </>
  );
};
