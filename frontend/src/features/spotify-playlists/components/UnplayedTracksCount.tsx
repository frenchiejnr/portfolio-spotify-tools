export const UnplayedTracksCount = ({ filteredTracks, playlist }) => {
  const unplayedCount = filteredTracks.length;
  return (
    <div className="">
      {unplayedCount} of {playlist.tracks.total} tracks unplayed
    </div>
  );
};
