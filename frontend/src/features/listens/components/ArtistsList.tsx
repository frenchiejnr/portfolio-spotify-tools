import { useEffect, useState } from "react";
import { getListOfArtists } from "..";
import Pagination from "@/components/Pagination";

export const ArtistsList = () => {
  const [artists, setArtists] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getArtists = async () => {
      setIsLoading(true);
      const response = await getListOfArtists();
      setArtists(() => response);
      setIsLoading(false);
    };
    getArtists();
  }, []);

  const sortedArtists = Object.entries(artists).sort(
    ([keyA, valueA], [keyB, valueB]) => valueB - valueA,
  );

  return (
    <div>
      {isLoading ? (
        <p>Loading Artists</p>
      ) : (
        <>
          <h1>Artist List</h1>
          <p>Total artists {Object.keys(artists).length}</p>
          <Pagination
            totalCount={Object.keys(artists).length}
            pageSize={10}
            data={sortedArtists}
          />

          {/* {sortedArtists.map((artist) => (
            <div key={artist[0]}>
              <p>{artist[0]}</p>
              <p>{artist[1]}</p>
            </div>
          ))} */}
        </>
      )}
    </div>
  );
};
