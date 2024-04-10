import { spotify } from "@/lib/spotify";

export const CreateUnplayedPlaylistButton = ({ playlist, filteredTracks }) => {
  const handleClick = async () => {
    try {
      const user: SpotifyApi.UserObjectPrivate = await spotify.get("/me");
      const userId = user.id;

      const newPlaylist = await spotify.post(`/users/${userId}/playlists`, {
        name: `${playlist.name} Unplayed Tracks`,
      });

      await addTracksToPlaylist(newPlaylist.id, filteredTracks);
    } catch (error) {}
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
  return (
    <button
      onClick={handleClick}
      className="mt-1 rounded-md bg-gray-200 px-2 text-left shadow hover:bg-gray-100"
    >
      Create Playlist of unplayed tracks
    </button>
  );
};
