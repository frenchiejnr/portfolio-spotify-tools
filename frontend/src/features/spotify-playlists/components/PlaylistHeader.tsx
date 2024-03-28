import { Link } from "react-router-dom";
import { UnplayedTracksCount } from "./UnplayedTracksCount";
import { CreateUnplayedPlaylistButton } from "./CreateUnplayedPlaylistButton";

type PlaylistHeaderProps = React.FC<{
  filteredTracks: SpotifyApi.PlaylistTrackObject[];
  isLoading: boolean;
  playlist: SpotifyApi.PlaylistObjectFull;
  setShowUnplayedOnly: React.Dispatch<React.SetStateAction<boolean>>;
  showUnplayedOnly: boolean;
}>;

export const PlaylistHeader: PlaylistHeaderProps = ({
  filteredTracks,
  isLoading,
  playlist,
  setShowUnplayedOnly,
  showUnplayedOnly,
}) => {
  return (
    <>
      <div>{playlist.name}</div>
      {showUnplayedOnly ? (
        <UnplayedTracksCount
          filteredTracks={filteredTracks}
          playlist={playlist}
        />
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
        <CreateUnplayedPlaylistButton
          playlist={playlist}
          filteredTracks={filteredTracks}
        />
      )}
    </>
  );
};
