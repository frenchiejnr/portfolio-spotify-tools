const MediaSortDropdown = ({
  sortMethod,
  handleSortChange,
}: {
  sortMethod: string;
  handleSortChange: (event: any) => void;
}) => (
  <div className="text-center">
    <select
      value={sortMethod}
      onChange={handleSortChange}
      className="text-base"
    >
      <option value="by-count">Sort by Play Count</option>
      <option value="by-name">Sort by Name</option>
      <option value="by-track-number">Sort by Track Number</option>
    </select>
  </div>
);

export default MediaSortDropdown;
