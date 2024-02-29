import { listenBrainz } from "@/lib/listenBrainz";
import { Listen, Recent_Listens_Payload } from "./types";
import storage from "@/utils/storage";
import { getData, setData } from "@/utils/indexDB";

export const getUserName = async () => {
  const response: any = await listenBrainz.get("/1/validate-token");
  const username = response.user_name;
  storage.setUserName(username);
  return username;
};

export const getListenCount = async (username: string) => {
  const response: any = await listenBrainz.get(
    `/1/user/${username}/listen-count`,
  );
  return response.payload.count;
};
export const listens: any = [];

export const fetchListens = async (fresh = false, timeStamp?: number) => {
  let username = storage.getUserName() || (await getUserName());
  const params: any = { count: 1000 };

  if (fresh && timeStamp) {
    params.max_ts = timeStamp;
  } else if (!fresh && timeStamp) {
    params.min_ts = timeStamp;
  }
  let response: Recent_Listens_Payload = await listenBrainz.get(
    `/1/user/${username}/listens`,
    {
      params,
    },
  );

  for (const listen of response.payload.listens) {
    listens.push(listen);
  }
  let payload_count = response.payload.count;
  setData("listens", listens);
  while (payload_count === 1000) {
    let nextTs: number;
    if (fresh) {
      nextTs =
        response.payload.listens[response.payload.listens.length - 1]
          .listened_at;
    } else {
      nextTs = response.payload.listens[0].listened_at;
    }
    await fetchListens(true, nextTs);
    break;
  }
  return listens;
};

export const checkForListens = async () => {
  const onServerCount: number = await getListenCount(await getUserName());
  let listens: Listen[] = (await getData("listens")) || [];
  let newListens: Listen[];

  if (!listens.length) {
    newListens = await fetchListens(true);
    setData("listens", newListens);
  }
  if (onServerCount === listens.length) {
    console.log(onServerCount, listens.length);
    return listens;
  } else {
    const timestamp = listens[0].listened_at;
    newListens = await fetchListens(false, timestamp);
    listens = [...newListens, ...listens];
    setData("listens", listens);
  }

  return listens;
};

export const countItems = async (
  listens: Listen[] = [],
  key: "artist_name" | "release_name" | "track_name",
) => {
  const counts: { [item: string]: number } = {};
  for (const listen of listens) {
    const item = listen.track_metadata[key];

    if (!counts[item]) {
      counts[item] = 0;
    }
    counts[item]++;
  }
  return counts;
};

const fetchAndCount = async (
  key: "artist_name" | "release_name" | "track_name",
) => {
  const listens = await checkForListens();
  return await countItems(listens, key);
};

export const getListOfArtists = async () => {
  return await fetchAndCount("artist_name");
};

export const getListOfAlbums = async () => {
  return await fetchAndCount("release_name");
};
export const getListOfTracks = async () => {
  return await fetchAndCount("track_name");
};
