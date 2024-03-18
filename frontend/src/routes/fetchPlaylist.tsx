import { spotify } from "@/lib/spotify";

export const fetchPlaylist = async ({ request, params }) => {
  let playlistObject: SpotifyApi.PlaylistObjectFull;
  const response: SpotifyApi.PlaylistObjectFull = await spotify.get(
    `/playlists/${params.playlistId}`,
    {
      signal: request.signal,
    },
  );
  playlistObject = response;

  return playlistObject;
};

export const fetchNextTracks = async (playlistObject, url?: string) => {
  if (!url) {
    return;
  }
  const newTracks: SpotifyApi.PlaylistTrackResponse = await spotify.get(url);
  playlistObject.tracks.items.push(...newTracks.items);
  playlistObject.tracks.next = newTracks.next;
  return playlistObject;
};
