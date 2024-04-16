import { addTracksToPlaylist, deleteTracksFromPlaylist } from "../utils";

export const ShufflePlaylistButton = ({
  tracks,
  playlist,
}: {
  tracks: SpotifyApi.PlaylistTrackObject[];
  playlist: SpotifyApi.PlaylistObjectFull;
}) => {
  const handleClick = async () => {
    await deleteTracksFromPlaylist(playlist.id, tracks);
    shuffleTracks(tracks);
    await addTracksToPlaylist(playlist.id, tracks);
  };

  const shuffleTracks = async (array: SpotifyApi.PlaylistTrackObject[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  return (
    <button
      className="mt-1 rounded-md bg-gray-200 px-2 text-left shadow hover:bg-gray-100"
      onClick={handleClick}
    >
      Shuffle Playlist
    </button>
  );
};
