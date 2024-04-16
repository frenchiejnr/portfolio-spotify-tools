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

const getUrlFromItem = (item: any, urlLocation: string): string | null => {
  // Split location into properties, handling potential index brackets
  const urlPath = urlLocation.split(".");
  let currentObject = item;

  for (const property of urlPath) {
    const indexMatch = property.match(/\[(\d+)\]$/); // Check for index at the end
    if (indexMatch) {
      const index = Number(indexMatch[1]); // Extract the index
      if (!Array.isArray(currentObject) || index >= currentObject.length) {
        return null; // Invalid index or not an array
      }
      currentObject = currentObject[index];
    } else {
      if (!currentObject.hasOwnProperty(property)) {
        return null; // Property not found
      }
      currentObject = currentObject[property];
    }
  }

  return Array.isArray(currentObject) ? currentObject[0] : currentObject;
};

export const getItemUrl = (item: any, urlLocation: string = "url") => {
  const url = getUrlFromItem(item, urlLocation);
  return url ? url.match(/\/(track|artist|album)\/([^/]+)/) : null;
};

export const processListensWithoutId = async (listens: Listen[]) => {
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

export const processListensForMissingSpotifyIds = async (
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
        ...groupInfo.listen.track_metadata.additional_info,
      };
    }
  });
};
