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

  const sortedData = useMemo(() => {
    if (sortByLastPlayed) {
      return data.sort((a, b) => b.lastPlayed - a.lastPlayed);
    } else {
      return data.sort((a, b) => b.count - a.count);
    }
  }, [sortByLastPlayed]);

  return (
    <div>
      {isLoading ? (
        <p>Loading {title}</p>
      ) : (
        <>
          <h1 className="text-xl font-bold my-2">{title} List</h1>
          <p className="text-lg font-semibold mb-1">
            Total {title} - {sortedData.length}
          </p>
          <label htmlFor="lastPlayed">
            <input
              type="checkbox"
              id="lastPlayed"
              checked={sortByLastPlayed}
              onChange={(e) => setSortByLastPlayed(e.target.checked)}
            />
            Sort by Last Played
          </label>
          <Pagination
            totalCount={sortedData.length}
            pageSize={10}
            data={data}
            ItemComponent={ListComponent}
          />
        </>
      )}
    </div>
  );
};
