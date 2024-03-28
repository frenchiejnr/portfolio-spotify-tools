import { checkForValidAccessToken } from "@/features/auth/api/checkForValidAccessToken";
import { spotify } from "@/lib/spotify";
import { useEffect, useState } from "react";

export const useMediaInfo = (
  id: string,
  mediaType: "track" | "album" | "artist",
) => {
  const [mediaInfo, setMediaInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchMedia = async () => {
      const endpoint =
        mediaType === "track"
          ? `/tracks/${id}`
          : mediaType === "album"
            ? `/albums/${id}`
            : `/artists/${id}`;
      const isTokenValid = await checkForValidAccessToken();
      if (isTokenValid) {
        const response = await spotify.get(endpoint);
        setMediaInfo(response);
      }
      setIsLoading(false);
    };
    fetchMedia();
  }, [id, mediaType]);

  return { mediaInfo, isLoading };
};
