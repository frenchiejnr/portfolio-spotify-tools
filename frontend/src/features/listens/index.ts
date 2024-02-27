import { listenBrainz } from "@/lib/listenBrainz";
import { Listen, Recent_Listens_Payload } from "./types";
import storage from "@/utils/storage";

export const getUserName = async () => {
  const response: any = await listenBrainz.get("/1/validate-token");
  const username = response.user_name;
  storage.setUserName(username);
  return username;
};

export const getListenCount = async () => {
  const username = await getUserName();
  const response: any = await listenBrainz.get(
    `/1/user/${username}/listen-count`
  );
  console.log(response.payload.count);
};
export const listens: any = [];

export const getAllListens = async (maxts?: number) => {
  let username = storage.getUserName();
  if (!username) {
    username = await getUserName();
  }
  const params: any = {};
  params.count = 1000;
  if (maxts) {
    params.max_ts = maxts;
  }
  let response: Recent_Listens_Payload = await listenBrainz.get(
    `/1/user/${username}/listens`,
    {
      params,
    }
  );
  for (const listen of response.payload.listens) {
    listens.push(listen);
  }
  let payload_count = response.payload.count;
  while (payload_count !== 0) {
    let nextMaxTs: number =
      response.payload.listens[response.payload.listens.length - 1].listened_at;
    await getAllListens(nextMaxTs);
    break;
  }
  return;
};

export const countItems = async (
  listens: Listen[] = [],
  key: "artist_name" | "release_name" | "track_name"
) => {
  const counts: { [item: string]: number } = {};
  if (!listens.length) {
    await getAllListens();
  }

  for (const listen of listens) {
    const item = listen.track_metadata[key];

    if (!counts[item]) {
      counts[item] = 0;
    }
    counts[item]++;
  }
  return counts;
};

export const getListOfArtists = async (listens: Listen[] = []) => {
  return await countItems(listens, "artist_name");
};

export const getListOfAlbums = async (listens: Listen[] = []) => {
  return await countItems(listens, "release_name");
};
export const getListOfTracks = async (listens: Listen[] = []) => {
  return await countItems(listens, "track_name");
};
