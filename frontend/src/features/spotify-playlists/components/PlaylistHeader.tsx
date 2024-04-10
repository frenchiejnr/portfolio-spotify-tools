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
      <div className="mt-1 w-full flex-grow basis-1/12 rounded-xl bg-indigo-200 p-2 text-right">
        <p className="text-xl font-bold">{playlist.name}</p>
        <p className="semi-bold text-lg">{playlist.owner.display_name}</p>
        <div className="flex flex-row-reverse justify-between">
          {showUnplayedOnly ? (
            <UnplayedTracksCount
              filteredTracks={filteredTracks}
              playlist={playlist}
            />
          ) : (
            <div>{playlist.tracks.total} tracks</div>
          )}
          {isLoading && (
            <p className="text-xs">
              {playlist.tracks?.items?.length} tracks loaded
            </p>
          )}
        </div>
      </div>
      <div className="mt-1 w-full rounded-xl bg-indigo-100 p-2">
        <div className="flex flex-row justify-between">
          <Link
            to={"/playlists"}
            className="rounded-md bg-gray-200 px-2 text-left shadow hover:bg-gray-100"
          >
            {"< "}All Playlists
          </Link>
          <label htmlFor="no-listens">
            <input
              type="checkbox"
              id="no-listens"
              checked={showUnplayedOnly}
              onChange={(e) => setShowUnplayedOnly(e.target.checked)}
            />
            Unplayed only
          </label>
        </div>
        {showUnplayedOnly && (
          <CreateUnplayedPlaylistButton
            playlist={playlist}
            filteredTracks={filteredTracks}
          />
        )}
      </div>
    </>
  );
};
