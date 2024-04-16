import { Listen } from "../types";
import { SpotifyLink } from "./SpotifyLink";
import { getItemUrl } from "../utils";
import { InternalLink } from "./Listen";
import { useState } from "react";
import { ArtistIcon } from "@/features/spotify-playlists/components/Icons";

export const MultipleArtists: React.FC<{
  artist_item_url: unknown;
  item: Listen;
}> = ({ item }) => {
  const [showArtists, setShowArtists] = useState(false);
  return (
    <div
      className="flex md:basis-1/3"
      onClick={() => setShowArtists(!showArtists)}
    >
      {showArtists ? (
        <div className="flex flex-col ">
          {item.track_metadata.additional_info.artist_names?.map(
            (artist, i) => (
              <div className="flex" key={artist}>
                <SpotifyLink
                  url={
                    item.track_metadata.additional_info.spotify_artist_ids?.[
                      i
                    ] || null
                  }
                />
                <div className="flex flex-row">
                  <ArtistIcon />
                  <InternalLink
                    url={
                      getItemUrl(
                        item,
                        `track_metadata.additional_info.spotify_artist_ids.[${i}]`,
                      )?.[0]
                    }
                    text={item.track_metadata.additional_info.artist_names[i]}
                  />
                </div>
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="ml-5 flex flex-row ">
          <ArtistIcon />
          <p className="pl-1 hover:font-medium hover:text-violet-400">
            {item.track_metadata.additional_info.artist_names?.length} Artists
          </p>
        </div>
      )}
    </div>
  );
};
