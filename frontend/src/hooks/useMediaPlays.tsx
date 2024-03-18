import { Listen } from "@/features/listens/types";
import { getData } from "@/utils/indexDB";
import { useEffect, useState } from "react";

export const useMediaPlays = (
  mediaId: string,
  mediaType: "track" | "artist",
) => {
  const [mediaPlays, setMediaPlays] = useState<Listen[]>([]);

  useEffect(() => {
    (async () => {
      const listens: Listen[] = await getData("listens");

      const filterSongPlays = listens.filter((listen) => {
        const mediaIdProperty =
          mediaType === "track"
            ? listen.track_metadata.additional_info.spotify_id
            : listen.track_metadata.additional_info.spotify_artist_ids?.[0];

        const regex = /\/(track|artist|album)\/([^/]+)/; // Matches "/track/" or "/artist/" followed by ID
        const match = mediaIdProperty?.match(regex);
        return match?.[2] === mediaId; // Access captured group (track/artist ID)
      });
      setMediaPlays(filterSongPlays);
    })();
  }, [mediaId, mediaType]);
  return mediaPlays;
};
