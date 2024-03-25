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
}) => (
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
    <label for="no-listens">
      <input
        type="checkbox"
        id="no-listens"
        checked={showUnplayedOnly}
        onChange={(e) => setShowUnplayedOnly(e.target.checked)}
      />
      Show Unplayed Songs only
    </label>
  </>
);
