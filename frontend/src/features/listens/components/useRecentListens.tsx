import { useEffect, useState } from "react";
import { getData, setData as setDBData } from "@/utils/indexDB";
import { Listen } from "../types";

export interface RecentListen extends Listen {
  listened_at: number;
  name?: string;
}

export type DataItem<T> = T;

export const useRecentListens = <T extends RecentListen>(
  dataKey: string,
  sortFn: (a: T, b: T) => number,
  refresh?: boolean,
) => {
  const [data, setData] = useState<DataItem<T>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLength, setDataLength] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      console.log(`refreshing ${dataKey} data`);
      setIsLoading(true);
      const response: DataItem<T>[] = await getData(dataKey);
      if (!response) {
        return;
      }
      response.sort(sortFn);

      const filteredResponse: DataItem<T>[] = [];
      const uniqueListens = new Set();
      for (const item of response) {
        const itemKey = `${item.listened_at}-${item.track_metadata?.track_name}`;
        if (!uniqueListens.has(itemKey)) {
          uniqueListens.add(itemKey);
          filteredResponse.push(item);
        }
      }
      await setDBData("listens", filteredResponse);
      setData(filteredResponse);
      setDataLength(filteredResponse.length);
      setIsLoading(false);
    };
    fetchData();
  }, [dataKey, refresh]);

  return { data, isLoading, dataLength };
};
