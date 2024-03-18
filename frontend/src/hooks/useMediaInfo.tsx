import { spotify } from "@/lib/spotify";
import { MediaItem } from "@/types";
import { useEffect, useState } from "react";

export const useMediaInfo = <T extends MediaItem>(
  id: string,
  mediaType: "track" | "album" | "artist",
) => {
  const [mediaInfo, setMediaInfo] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchMedia = async () => {
      const endpoint =
        mediaType === "track"
          ? `/tracks/${id}`
          : mediaType === "album"
            ? `/album/${id}`
            : `/artists/${id}`;
      const response: T = await spotify.get(endpoint);
      setMediaInfo(response);
      setIsLoading(false);
    };
    fetchMedia();
  }, [id, mediaType]);

  return { mediaInfo, isLoading };
};
