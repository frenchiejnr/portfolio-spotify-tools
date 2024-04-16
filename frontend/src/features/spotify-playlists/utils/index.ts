import { spotify } from "@/lib/spotify";

export const addTracksToPlaylist = async (playlistId, tracks) => {
  const trackBatches = [];

  for (let i = 0; i < tracks.length; i += 100) {
    trackBatches.push(tracks.slice(i, i + 100));
  }
  for (const batch of trackBatches) {
    const trackUris = batch.map((track) => track.track?.uri);
    await spotify.post(`/playlists/${playlistId}/tracks`, {
      uris: trackUris,
    });
  }
};

export const deleteTracksFromPlaylist = async (playlistId, tracks) => {
  const trackBatches = [];

  for (let i = 0; i < tracks.length; i += 100) {
    trackBatches.push(tracks.slice(i, i + 100));
  }
  for (const batch of trackBatches) {
    const trackUris = batch.map((track) => ({
      uri: track.track?.uri, // Handle potential undefined uri property
    }));

    await spotify.delete(`/playlists/${playlistId}/tracks`, {
      data: {
        tracks: trackUris,
      },
    });
  }
};
