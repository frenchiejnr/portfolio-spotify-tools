import { listenBrainz } from "@/lib/listenBrainz";
import { getData, setData } from "@/utils/indexDB";
import storage from "@/utils/storage";
import { Listen, Recent_Listens_Payload, MediaItemWithCount } from "../types";

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
): Promise<MediaItemWithCount[]> => {
  const results = new Map();
  for (const listen of listens) {
    let itemName = listen.track_metadata[key];
    let itemId: string;
    switch (key) {
      case "artist_name":
        itemId = listen.track_metadata.additional_info.spotify_artist_ids?.[0];
        break;
      case "release_name":
        itemId = listen.track_metadata.additional_info.spotify_album_id;
        break;
      case "track_name":
        itemId = listen.track_metadata.additional_info.spotify_id;
        break;
      default:
        itemId = "";
        break;
    }

    if (!itemId) {
      itemName = "Unknown";
    }

    const existingEntry = results.get(itemId);
    if (existingEntry) {
      existingEntry.count++;
      existingEntry.lastPlayed = new Date(
        Math.max(
          existingEntry.lastPlayed?.getTime() || 0,
          listen.listened_at * 1000,
        ),
      );
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
          url = listen.track_metadata.additional_info.spotify_id;
          break;
        default:
          url = "";
          break;
      }

      results.set(itemId, {
        name: itemName,
        id: itemId,
        url,
        count: 1,
        lastPlayed: new Date(listen.listened_at * 1000),
      });
    }
  }

  return Array.from(results.values()) // Get the values (objects) from the Map
    .filter((item) => item.name !== "Unknown")
    .sort((a, b) => b.count - a.count);
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
function getUrlFromItem(item: any, urlLocation: string): string | null {
  // Check if the requested location exists in the item
  const urlPath = urlLocation.split("."); // Split location into nested properties
  let currentObject = item;

  for (const property of urlPath) {
    if (!currentObject.hasOwnProperty(property)) {
      return null; // Location not found
    }
    currentObject = currentObject[property];
  }

  // Handle potential array structure (assuming the last property might be an array)
  return Array.isArray(currentObject) ? currentObject[0] : currentObject;
}

export const getItemUrl = (item: any, urlLocation = "url") => {
  // Leverage getUrlFromItem to handle location and potential nesting
  const url = getUrlFromItem(item, urlLocation);

  // Check if URL was found
  if (!url) {
    return null;
  }

  // Apply the original URL extraction logic using the regex
  const match = url.match(/\/(track|artist|album)\/([^/]+)/);
  return match;
};
