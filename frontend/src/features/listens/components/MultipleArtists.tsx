import { Listen } from "../types";
import { SpotifyLink } from "./SpotifyLink";
import { getItemUrl } from "../utils";
import { InternalLink } from "./Listen";
import { useState } from "react";

export const MultipleArtists: React.FC<{
  artist_item_url: unknown;
  item: Listen;
}> = ({ item }) => {
  const [showArtists, setShowArtists] = useState(false);
  return (
    <div className="flex" onClick={() => setShowArtists(!showArtists)}>
      {showArtists ? (
        <div className="flex flex-col sm:basis-1/4">
          {item.track_metadata.additional_info.artist_names?.map(
            (artist, i) => (
              <p className="flex" key={artist}>
                <SpotifyLink
                  url={
                    item.track_metadata.additional_info.spotify_artist_ids?.[
                      i
                    ] || null
                  }
                />
                <InternalLink
                  url={
                    getItemUrl(
                      item,
                      `track_metadata.additional_info.spotify_artist_ids.[${i}]`,
                    )?.[0]
                  }
                  text={item.track_metadata.additional_info.artist_names[i]}
                />
              </p>
            ),
          )}
        </div>
      ) : (
        <p className="ml-5 pl-4 hover:font-medium hover:text-violet-400">
          {item.track_metadata.additional_info.artist_names?.length} Artists
        </p>
      )}
    </div>
  );
};
