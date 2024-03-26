import { spotify } from "@/lib/spotify";
import { Link } from "react-router-dom";

export const PlaylistHeader: React.FC<{
  filteredTracks: SpotifyApi.PlaylistTrackObject[];
  isLoading: boolean;
  playlist: SpotifyApi.PlaylistObjectFull;
  setShowUnplayedOnly: React.Dispatch<React.SetStateAction<boolean>>;
  showUnplayedOnly: boolean;
}> = ({
  filteredTracks,
  isLoading,
  playlist,
  setShowUnplayedOnly,
  showUnplayedOnly,
}) => {
  const handleCreateUnplayedPlaylist = async () => {
    const response: SpotifyApi.UserObjectPrivate = await spotify.get("/me");
    const userId = response.id;
    const newPlaylist = await spotify.post(`/users/${userId}/playlists`, {
      name: `${playlist.name} Unplayed Tracks`,
    });
    console.log(filteredTracks);
    const totalTracks = filteredTracks.length;

    const trackBatches = [];

    for (let i = 0; i < totalTracks; i += 100) {
      trackBatches.push(filteredTracks.slice(i, i + 100));
    }
    for (const batch of trackBatches) {
      const trackUris = batch.map((track) => track.track?.uri);
      await spotify.post(`/playlists/${newPlaylist.id}/tracks`, {
        uris: trackUris,
      });
    }
  };

  return (
    <>
      <div>{playlist.name}</div>
      {showUnplayedOnly ? (
        <div>
          {filteredTracks.length} of {playlist.tracks.total} tracks unplayed
        </div>
      ) : (
        <div>{filteredTracks.length} tracks</div>
      )}
      <Link to={"/playlists"}>Back to Playlists</Link>
      {isLoading && (
        <p>
          {playlist.tracks?.items?.length} of {playlist.tracks?.total} Loaded
        </p>
      )}
      <label htmlFor="no-listens">
        <input
          type="checkbox"
          id="no-listens"
          checked={showUnplayedOnly}
          onChange={(e) => setShowUnplayedOnly(e.target.checked)}
        />
        Show Unplayed Songs only
      </label>
      {showUnplayedOnly && (
        <button onClick={handleCreateUnplayedPlaylist}>
          Create Playlist of unplayed tracks
        </button>
      )}
    </>
  );
};
