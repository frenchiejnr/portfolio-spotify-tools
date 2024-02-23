import { spotify } from "@/lib/spotify";
import storage from "@/utils/storage";

import { UsersRecentlyPlayedTracksResponse } from "spotify-api";

export const handleGetMe = async () => {
  console.log(storage.getAccessToken());
  const userData = await spotify.get("/me", {
    headers: {
      Authorization: `Bearer ${storage.getAccessToken()}`,
    },
  });
  console.log(userData);
};

export const handleGetRecentlyPlayed = async (
  e: Event,
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

  const headers = {
    Authorization: `Bearer ${storage.getAccessToken()}`,
  };

  try {
    const response: UsersRecentlyPlayedTracksResponse = await spotify.get(url, {
      params,
      headers,
    });

    console.log(response);
    const data = response.items;
    console.log(data);
  } catch (error) {}
};
