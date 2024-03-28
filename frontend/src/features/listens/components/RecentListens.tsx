import Pagination from "@/components/Pagination";
import { getData, setData as setDBData } from "@/utils/indexDB";
import { useEffect, useState } from "react";
import { ListenComponent } from "./Listen";
import { Listen } from "../types";

export const RecentListens = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLength, setDataLength] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      console.log(`refreshing recent listens`);
      setIsLoading(true);
      let response: Listen[] = await getData("listens");
      response.sort((a, b) => b.listened_at - a.listened_at);

      const filteredResponse = [];
      const uniqueListens = new Set();
      for (const listen of response) {
        const listenKey = `${listen.listened_at}-${listen.track_metadata.track_name}`;
        if (!uniqueListens.has(listenKey)) {
          uniqueListens.add(listenKey);
          filteredResponse.push(listen);
        }
      }
      await setDBData("listens", filteredResponse);
      setData(filteredResponse);
      setDataLength(filteredResponse.length);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <p>Loading Recent Listens</p>
      ) : (
        <>
          <h1 className="text-xl font-bold my-2">Recent Listens</h1>
          <p className="text-lg font-semibold mb-1">
            Total Listens - {dataLength}
          </p>
          <Pagination
            totalCount={dataLength}
            pageSize={10}
            data={data}
            ItemComponent={ListenComponent}
          />
        </>
      )}
    </>
  );
};
