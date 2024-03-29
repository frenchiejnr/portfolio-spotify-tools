import { spotify } from "@/lib/spotify";
import storage from "@/utils/storage";

import { UsersRecentlyPlayedTracksResponse } from "spotify-api";

export const handleGetMe = async () => {
  const userData = await spotify.get("/me", {
    headers: {
      Authorization: `Bearer ${storage.getToken("spotify")}`,
    },
  });
  console.log(userData);
};

export const handleGetRecentlyPlayed = async (
  e: React.MouseEvent<HTMLButtonElement>,
  after?: string,
  limit = 10,
) => {
  e.preventDefault();
  const url = `/me/player/recently-played`;
  const params: { limit: number; after?: string } = { limit };
  console.log(after);
  if (after) {
    params.after = after;
  }

  try {
    const response: UsersRecentlyPlayedTracksResponse = await spotify.get(url, {
      params,
    });

    console.log(response);
    const data = response.items;
    console.log(data);
  } catch (error) {}
};
