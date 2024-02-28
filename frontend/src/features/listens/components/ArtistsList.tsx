import { useEffect, useState } from "react";
import { getListOfArtists, listens } from "..";

export const ArtistsList = () => {
  const [artists, setArtists] = useState({});
  useEffect(() => {
    async function getArtists() {
      const response = await getListOfArtists(listens);
      setArtists(response);
      console.log(listens);
      console.log(artists);
    }
    getArtists();
  }, []);

  const sortedArtists = Object.entries(artists).sort(
    ([keyA, valueA], [keyB, valueB]) => valueB - valueA
  );

  return (
    <>
      <h1>Artist List</h1>
      <p>Total artists {Object.keys(artists).length}</p>
      {sortedArtists.map((artist) => (
        <>
          <p key={artist[0]}>{artist[0]}</p>
          <p key={artist[0]}>{artist[1]}</p>
        </>
      ))}
    </>
  );
};
