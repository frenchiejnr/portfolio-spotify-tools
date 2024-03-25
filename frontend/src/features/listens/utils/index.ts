import { listenBrainz } from "@/lib/listenBrainz";
import { getData, setData } from "@/utils/indexDB";
import storage from "@/utils/storage";
import { Listen, Recent_Listens_Payload } from "../types";

export const listens: any = [];

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
  let storedListens: Listen[] = (await getData("listens")) || [];
  let newListens: Listen[];

  if (!storedListens.length) {
    newListens = await fetchListens(true);
    setData("listens", newListens);
  } else if (onServerCount <= storedListens.length) {
    console.log(onServerCount, storedListens.length);
    return storedListens;
  } else {
    const timestamp = storedListens[0].listened_at;
    newListens = await fetchListens(false, timestamp);
    storedListens = [...newListens, ...storedListens];
    setData("listens", storedListens);
  }
};

export const countItems = async (
  listens: Listen[] = [],
  key: "artist_name" | "release_name" | "track_name",
) => {
  const results: { name: string; url: string; count: number }[] = [];
  for (const listen of listens) {
    let item;
    if (key === "track_name") {
      item = `${listen.track_metadata["track_name"]}-${listen.track_metadata["release_name"]}`;
    } else {
      item = listen.track_metadata[key];
    }
    const existingIndex = results.findIndex((entry) => entry.name === item);

    if (existingIndex !== -1) {
      // Item already exists, increase count
      results[existingIndex].count++;
    } else {
      let url;
      switch (key) {
        case "artist_name":
          url = listen.track_metadata.additional_info.spotify_artist_ids;
          break;
        case "release_name":
          url = listen.track_metadata.additional_info.spotify_album_id;
          break;
        case "track_name":
          url = listen.track_metadata.additional_info.origin_url;
          break;

        default:
          url = "";
          break;
      }
      // New item, add to results with count 1

      results.push({ name: item, url, count: 1 });
    }
  }

  return results;
};

export const getListOfArtists = async () => {
  return await countItems(await getData("listens"), "artist_name");
};
export const getListOfAlbums = async () => {
  return await countItems(await getData("listens"), "release_name");
};
export const getListOfTracks = async () => {
  return await countItems(await getData("listens"), "track_name");
};
export const getItemUrl = (item: any) => {
  const regex = /\/(track|artist|album)\/([^/]+)/; // Matches "/track/" or "/artist/" followed by ID
  const url = Array.isArray(item.url) ? item.url[0] : item.url;
  const match = url?.match(regex);
  return match;
};
