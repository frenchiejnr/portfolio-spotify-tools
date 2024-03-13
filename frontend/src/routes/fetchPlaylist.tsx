import { spotify } from "@/lib/spotify";
import { defer } from "react-router-dom";

export const fetchPlaylist = async ({ request, params }) => {
  let playlistObject: SpotifyApi.PlaylistObjectFull;
  const response: SpotifyApi.PlaylistObjectFull = await spotify.get(
    `/playlists/${params.playlistId}`,
    {
      signal: request.signal,
    },
  );
  playlistObject = response;

  // if (playlistObject.tracks.next) {
  //   await fetchNextTracks(playlistObject.tracks.next.split("/v1/")[1]);
  // }

  return playlistObject;
};

export const fetchNextTracks = async (playlistObject, url?: string) => {
  if (!url) {
    return;
  }
  const newTracks: SpotifyApi.PlaylistTrackResponse = await spotify.get(url);
  playlistObject.tracks.items.push(...newTracks.items);
  playlistObject.tracks.next = newTracks.next;
  // if (newTracks.next) {
  //   await fetchNextTracks(playlistObject, newTracks.next.split("/v1/")[1]);
  // }
  return playlistObject;
};
