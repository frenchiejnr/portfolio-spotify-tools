import { spotify } from "@/lib/spotify";
import { useEffect, useState } from "react";

export const useTrackInfo = (trackId: string) => {
  const [trackInfo, setTrackInfo] = useState<SpotifyApi.TrackObjectFull | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const response: SpotifyApi.TrackObjectFull = await spotify.get(
        `/tracks/${trackId}`,
      );
      setTrackInfo(response);
      setIsLoading(false);
    })();
  }, [trackId]);

  return { trackInfo, isLoading };
};
