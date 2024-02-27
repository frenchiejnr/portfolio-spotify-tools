import { listenBrainz } from "@/lib/listenBrainz";

export const getUserName = async () => {
  const response: any = await listenBrainz.get("/1/validate-token");
  const username = response.user_name;
  return username;
};

export const getListenCount = async () => {
  const username = await getUserName();
  const response: any = await listenBrainz.get(
    `/1/user/${username}/listen-count`
  );
  console.log(response.payload.count);
};
export const listens = [];

export const getAllListens = async (maxts?: string) => {
  const username = await getUserName();
  const params: any = {};
  params.count = 1000;
  if (maxts) {
    params.max_ts = maxts;
  }
  let response: any = await listenBrainz.get(`/1/user/${username}/listens`, {
    params,
  });
  for (const listen of response.payload.listens) {
    listens.push(listen);
  }
  let payload_count = response.payload.count;
  while (payload_count !== 0) {
    let nextMaxTs =
      response.payload.listens[response.payload.listens.length - 1].listened_at;
    await getAllListens(nextMaxTs);
    break;
  }
  return;
};

export const getListOfArtists = async (listens = []) => {
  const artistCounts: { [artist: string]: number } = {};
  if (listens.length === 0) {
    await getAllListens();
  }
  console.log(listens);
  for (const listen of listens) {
    const artist = listen.track_metadata.artist_name;
    if (!artistCounts[artist]) {
      artistCounts[artist] = 0;
    }
    artistCounts[artist]++;
  }
  return artistCounts;
};
