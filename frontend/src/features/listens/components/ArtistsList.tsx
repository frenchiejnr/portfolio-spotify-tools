import { useEffect, useState } from "react";
import { getListOfArtists, listens } from "..";
import { getData } from "@/utils/indexDB";

export const ArtistsList = () => {
  const [artists, setArtists] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getArtists = async () => {
      setIsLoading(true);
      const response = await getListOfArtists();
      console.log(response);
      setArtists(() => response);
      setIsLoading(false);
    };
    getArtists();
  }, []);

  const sortedArtists = Object.entries(artists).sort(
    ([keyA, valueA], [keyB, valueB]) => valueB - valueA
  );

  return (
    <div>
      {isLoading ? (
        <p>Loading Artists</p>
      ) : (
        <>
          <h1>Artist List</h1>
          <p>Total artists {Object.keys(artists).length}</p>
          {sortedArtists.map((artist) => (
            <div key={artist[0]}>
              <p>{artist[0]}</p>
              <p>{artist[1]}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
