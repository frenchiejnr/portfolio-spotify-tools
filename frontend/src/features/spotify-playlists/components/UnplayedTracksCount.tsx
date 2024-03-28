export const UnplayedTracksCount = ({ filteredTracks, playlist }) => {
  const unplayedCount = filteredTracks.length;
  return (
    <div>
      {unplayedCount} of {playlist.tracks.total} tracks unplayed
    </div>
  );
};
