import { useEffect, useMemo, useState } from "react";
import Pagination from "@/components/Pagination";
import { ListComponent } from "./ListComponent";

export const DataList = ({
  getData,
  title,
  refresh,
}: {
  getData: any;
  title: any;
  refresh: boolean;
}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortByLastPlayed, setSortByLastPlayed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log(`reloading`);
      setIsLoading(true);
      const response = await getData();
      setData(() => response);
      setIsLoading(false);
    };
    fetchData();
  }, [, refresh]);

  useMemo(() => {
    if (sortByLastPlayed) {
      return data.sort((a, b) => b.lastPlayed - a.lastPlayed);
    } else {
      return data.sort((a, b) => b.count - a.count);
    }
  }, [, sortByLastPlayed]);

  return (
    <div className="m-auto flex h-dvh w-5/6 flex-col">
      {isLoading ? (
        <p>Loading {title}</p>
      ) : (
        <>
          <div className="mt-1 w-full flex-grow basis-1/12 rounded-xl bg-indigo-200 p-2">
            <h1 className="text-right text-xl font-bold">{title} List</h1>
            <p className="text-right text-lg font-semibold">
              Total {title} - {data.length}
            </p>
            <hr className="border-black" />
            <p className="text-right">
              <input
                type="checkbox"
                id="lastPlayed"
                checked={sortByLastPlayed}
                onChange={(e) => setSortByLastPlayed(e.target.checked)}
                className=""
              />
              <label htmlFor="lastPlayed" className="pl-1">
                Sort by Last Played
              </label>
            </p>
          </div>
          <div className="basis-11/12">
            <Pagination
              totalCount={data.length}
              pageSize={10}
              data={data}
              ItemComponent={ListComponent}
            />
          </div>
        </>
      )}
    </div>
  );
};
