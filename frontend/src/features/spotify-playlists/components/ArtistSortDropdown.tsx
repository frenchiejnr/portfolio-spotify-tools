const ArtistSortDropdown = ({
  sortMethod,
  handleSortChange,
}: {
  sortMethod: string;
  handleSortChange: (event: any) => void;
}) => (
  <select value={sortMethod} onChange={handleSortChange}>
    <option value="by-count">Sort by Play Count</option>
    <option value="by-name">Sort by Name</option>
    <option value="by-track-number">Sort by Track Number</option>
  </select>
);

export default ArtistSortDropdown;
