import { useEffect, useState } from "react";
import storage from "@/utils/storage";
import { getAccessToken } from "@/features/auth";
import { checkForListens } from "@/features/listens/utils";
import { LoginButton } from "@/features/auth/components/LoginButton";
import { Link } from "react-router-dom";
import { Listen } from "@/features/listens/types";
import { getData, setData as setDBData } from "@/utils/indexDB";
import { RecentListensDisplay } from "@/features/listens/components/RecentListensDisplay";
import { ListenComponent } from "@/features/listens/components/Listen";

export type DataItem<T> = T;

function HomePage() {
  const [isFetchingListens, setIsFetchingListens] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [data, setData] = useState<DataItem<T>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLength, setDataLength] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      console.log(`refreshing listens data`);
      setIsLoading(true);
      const response: DataItem<T>[] = await getData("listens");
      if (!response) {
        return;
      }
      response.sort((a, b) => b.listened_at - a.listened_at);

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
  }, []);

  useEffect(() => {
    const retrieveSpotifyToken = async () => {
      const existingToken = storage.getToken("spotify");
      if (existingToken && existingToken !== "Bearer undefined") {
        // Token is present and valid, no need to fetch again
        setValidToken(true);
        return;
      }
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get("code");
      if (authCode) {
        const tokenResponse = await getAccessToken(authCode);
        const { access_token, refresh_token, expires_in } = tokenResponse;
        storage.setToken("spotify", `Bearer ${access_token}`);
        storage.setRefreshToken("spotify", `${refresh_token}`);
        storage.setExpiresIn("spotify", `${parseInt(expires_in)}`);
        setValidToken(true);
        return;
      }
      setValidToken(false);
    };
    retrieveSpotifyToken();
  }, []);

  useEffect(() => {
    getListens();
  }, []);

  const getListens = async () => {
    if (isFetchingListens) {
      return;
    }
    setIsFetchingListens(true);
    setRefresh(true);
    await checkForListens();
    console.log(`Finished Refreshing Listens`);
    setIsFetchingListens(false);
    setRefresh(false);
  };

  const handleListensWithoutId = async () => {
    const listens: Listen[] = await getData("listens");
    console.log(
      listens.filter(
        (listen) => !listen.track_metadata.additional_info.spotify_id,
      ).length,
    );
    console.time();

    const groupListensByMetadata = async (listens: Listen[]) => {
      const groupedListens = new Map();
      listens.forEach((listen) => {
        const key = `
        ${listen.track_metadata.track_name}-
        ${listen.track_metadata.artist_name}-
        ${listen.track_metadata.release_name}
        `;

        if (!groupedListens.has(key)) {
          groupedListens.set(key, {
            listen,
            newestListenedAt: listen.listened_at,
          });
        } else {
          const existingListen = groupedListens.get(key);
          if (listen.listened_at > existingListen.newestListenedAt) {
            groupedListens.set(key, {
              listen,
              newestListenedAt: listen.listened_at,
            });
          }
        }
      });
      return groupedListens;
    };

    const updateSpotifyIds = async (
      listens: Listen[],
      groupedListens: Map<string, { listen: Listen; newestListenedAt: number }>,
    ) => {
      listens.forEach((listen) => {
        const key = `
        ${listen.track_metadata.track_name}-
        ${listen.track_metadata.artist_name}-
        ${listen.track_metadata.release_name}
        `;
        const groupInfo = groupedListens.get(key);
        if (groupInfo) {
          listen.track_metadata.additional_info = {
            ...listen.track_metadata.additional_info,
            spotify_id:
              groupInfo.listen.track_metadata.additional_info.spotify_id,
            spotify_artist_ids:
              groupInfo.listen.track_metadata.additional_info
                .spotify_artist_ids,
            spotify_album_id:
              groupInfo.listen.track_metadata.additional_info.spotify_album_id,
          };
        }
      });
    };
    const groupedListens = await groupListensByMetadata(listens);

    await updateSpotifyIds(listens, groupedListens);

    console.timeEnd();

    console.log(
      listens.filter(
        (listen) => !listen.track_metadata.additional_info.spotify_id,
      ).length,
    );
    setDBData("listens", listens);
  };

  return (
    <>
      {validToken ? (
        <>
          <div
            className={`flex w-full flex-col justify-between bg-indigo-300 p-1 pt-0`}
          >
            <div className="flex justify-around">
              <button
                disabled={isFetchingListens}
                onClick={getListens}
                className="mt-1 rounded-md bg-gray-200 px-2 text-left shadow hover:bg-gray-100"
              >
                Check For More Listens
              </button>
              <button
                onClick={handleListensWithoutId}
                className="mt-1 rounded-md bg-gray-200 px-2 text-left shadow hover:bg-gray-100"
              >
                Songs missing spotify Id
              </button>
            </div>
            <div className="flex justify-around">
              <Link
                to={"/"}
                className="mt-1 rounded-md bg-gray-200 px-2 text-left shadow hover:bg-gray-100"
              >
                Home
              </Link>
              <Link
                to={"/playlists"}
                className="mt-1 rounded-md bg-gray-200 px-2 text-left shadow hover:bg-gray-100"
              >
                Playlists
              </Link>
              <Link
                to={"/album"}
                className="mt-1 rounded-md bg-gray-200 px-2 text-left shadow hover:bg-gray-100"
              >
                Albums
              </Link>
              <Link
                to={"/artist"}
                className="mt-1 rounded-md bg-gray-200 px-2 text-left shadow hover:bg-gray-100"
              >
                Artists
              </Link>
              <Link
                to={"/track"}
                className="mt-1 rounded-md bg-gray-200 px-2 text-left shadow hover:bg-gray-100"
              >
                Tracks
              </Link>
            </div>
          </div>
          <div className="m-auto flex h-dvh w-5/6 flex-col">
            {isFetchingListens ? (
              <h1>Fetching Listens - Fetched x listens</h1>
            ) : (
              <RecentListensDisplay
                data={data}
                dataLength={dataLength}
                ItemComponent={ListenComponent}
                title={"Recent Listens"}
                totalLabel={"Listens"}
              />
            )}
          </div>
        </>
      ) : (
        <div className="flex content-center justify-center">
          <LoginButton />
        </div>
      )}
    </>
  );
}

export default HomePage;
