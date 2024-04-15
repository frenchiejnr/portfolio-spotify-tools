import { spotify } from "@/lib/spotify";

export const ShufflePlaylistButton = (tracks) => {
  const handleClick = async () => {
    await deleteTracksFromPlaylist(tracks.playlist.id, tracks.tracks);
    shuffleTracks(tracks.tracks);

    await addTracksToPlaylist(tracks.playlist.id, tracks.tracks);
  };

  const addTracksToPlaylist = async (playlistId, tracks) => {
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
  const deleteTracksFromPlaylist = async (playlistId, tracks) => {
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

  const shuffleTracks = async (array: []) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };
  return <button onClick={handleClick}>Shuffle Playlist</button>;
};
