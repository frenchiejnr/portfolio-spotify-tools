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

export const getAllListens = async (e: any, maxts?: string) => {
  const username = await getUserName();
  const params: any = {};
  params.count = 1000;
  if (maxts) {
    params.max_ts = maxts;
  }
  const response: any = await listenBrainz.get(`/1/user/${username}/listens`, {
    params,
  });
  console.log(response);

  if (response.payload.count > 0) {
    console.log(response.payload.count);
    getAllListens(
      e,
      response.payload.listens[response.payload.listens.length - 1].listened_at
    );
  }
  console.log(`finished`);
};
