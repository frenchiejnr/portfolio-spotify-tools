import { Listen } from "@/features/listens/types";
import { getData } from "@/utils/indexDB";
import { useEffect, useState } from "react";

export const useSongPlays = (trackId: string) => {
  const [songPlays, setSongPlays] = useState<Listen[]>([]);

  useEffect(() => {
    (async () => {
      const listens: Listen[] = await getData("listens");

      const filterSongPlays = listens.filter(
        (listen) =>
          listen.track_metadata.additional_info.spotify_id?.split(
            "/track/",
          )[1] === trackId,
      );
      setSongPlays(filterSongPlays);
    })();
  }, []);
  return songPlays;
};
