import Pagination from "@/components/Pagination";
import { getData, setData as setDBData } from "@/utils/indexDB";
import { useEffect, useState } from "react";
import { ListenComponent } from "./Listen";
import { Listen } from "../types";

export const RecentListens = ({ refresh }: { refresh: boolean }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log(`refreshing recent listens`);
      setIsLoading(true);
      let response: Listen[] = await getData("listens");
      response.sort((a, b) => b.listened_at - a.listened_at);

      const filteredResponse = response.filter((item, index) => {
        const existingIndex = response.findIndex(
          (d) =>
            d.listened_at === item.listened_at &&
            d.track_metadata.track_name === item.track_metadata.track_name,
        );
        // Return true only if the current item's index is the same as the first occurrence index
        return index === existingIndex;
      });
      await setDBData("listens", filteredResponse);
      setData(() => filteredResponse);
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
