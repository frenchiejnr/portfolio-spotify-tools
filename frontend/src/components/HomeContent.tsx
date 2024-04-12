import {
  handleGetMe,
  handleGetRecentlyPlayed,
} from "@/features/spotify-user-info";
import { Link } from "react-router-dom";
import { RecentListensDisplay } from "@/features/listens/components/RecentListensDisplay";
import { ListenComponent } from "@/features/listens/components/Listen";
import { useRecentListens } from "@/features/listens/components/useRecentListens";
import { Listen } from "@/features/listens/types";
import {
  getListOfArtists,
  getListOfAlbums,
  getListOfTracks,
  processListensWithoutId,
  processListensForMissingSpotifyIds,
} from "@/features/listens/utils";
import { getData, setData } from "@/utils/indexDB";
import { useListenData } from "@/hooks/useListenData";

export const HomeContent: React.FC<{}> = () => {
  const { isFetchingListens, getListens } = useListenData();
  const { data, dataLength } = useRecentListens(
    "listens",
    (a, b) => b.listened_at - a.listened_at,
  );

  const handleListenBrainz = async () => {
    let response = await getListOfArtists();
    console.log(response);
    response = await getListOfAlbums();
    console.log(response);
    response = await getListOfTracks();
    console.log(response);
  };

  const handleListensWithoutId = async () => {
    const listens: Listen[] = await getData("listens");
    console.log(
      listens.filter(
        (listen) => !listen.track_metadata.additional_info.spotify_id,
      ).length,
    );
    console.time();

    const groupedListens = await processListensWithoutId(listens);

    await processListensForMissingSpotifyIds(listens, groupedListens);

    console.timeEnd();

    console.log(
      listens.filter(
        (listen) => !listen.track_metadata.additional_info.spotify_id,
      ).length,
    );
    setData("listens", listens);
  };
  return (
    <>
      <button
        disabled={isFetchingListens}
        onClick={() => {
          getListens();
        }}
      >
        Check For More Listens
      </button>
      <br />
      <Link to={"/playlists"}>Playlists</Link>
      <Link to={"/album"}>Albums</Link>
      <Link to={"/artist"}>Artists</Link>
      <Link to={"/track"}>Tracks</Link>
      <button onClick={handleGetMe}>Get me</button>
      <button type="button" onClick={handleGetRecentlyPlayed}>
        Get recently played
      </button>
      <button onClick={handleListenBrainz}>Log on to listenbrainz</button>
      <button onClick={handleListensWithoutId}>Songs missing spotify Id</button>
      {isFetchingListens ? (
        <h1>Fetching Listens - Fetched x listens</h1>
      ) : (
        <>
          <RecentListensDisplay
            data={data}
            dataLength={dataLength}
            ItemComponent={ListenComponent}
            title={"Recent Listens"}
            totalLabel={"Listens"}
          />
        </>
      )}
    </>
  );
};
