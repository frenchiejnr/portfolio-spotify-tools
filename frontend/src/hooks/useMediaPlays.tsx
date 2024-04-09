import { Listen } from "@/features/listens/types";
import { getData } from "@/utils/indexDB";
import { useEffect, useState } from "react";

export const useMediaPlays = (
  mediaId: string,
  mediaType: "track" | "artist" | "album",
) => {
  const [mediaPlays, setMediaPlays] = useState<Listen[]>([]);

  const extractMediaIds = (mediaIdProperty: string, mediaId: string) => {
    const extractedIds = [];
    const regex = /\/(track|artist|album)\/([^/]+)/; // Matches "/track/" or "/artist/" followed by ID
    if (Array.isArray(mediaIdProperty)) {
      // Handle array of strings
      for (const item of mediaIdProperty) {
        const match = item?.match(regex);
        if (match) {
          extractedIds.push(match[2]); // Extract the ID (group 2)
        }
      }
    } else if (typeof mediaIdProperty === "string") {
      // Handle single string
      const match = mediaIdProperty.match(regex);
      if (match) {
        extractedIds.push(match[2]); // Extract the ID (group 2)
      }
    }
    return extractedIds.filter((id) => id === mediaId); // Filter extracted IDs that match mediaId
  };

  useEffect(() => {
    (async () => {
      const listens: Listen[] = await getData("listens");

      const filterSongPlays = listens.filter((listen) => {
        const mediaIdProperty =
          mediaType === "track"
            ? listen.track_metadata.additional_info.spotify_id
            : mediaType === "artist"
              ? listen.track_metadata.additional_info.spotify_artist_ids
              : listen.track_metadata.additional_info.spotify_album_id;
        const extractedIds = extractMediaIds(mediaIdProperty, mediaId);

        return extractedIds.length > 0;
      });
      setMediaPlays(filterSongPlays);
    })();
  }, [mediaId, mediaType]);
  return mediaPlays;
};
