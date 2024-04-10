import Pagination from "@/components/Pagination";
import { PlaylistTracks } from "./PlaylistTracks";

export const PlaylistTracksTable: React.FC<{
  filteredTracks: SpotifyApi.PlaylistTrackObject[];
  songCounts: {};
}> = ({ filteredTracks, songCounts }) => (
  <>
    <div className="mx-auto flex w-4/5 justify-between">
      <div className=" ml-1 basis-1/4">
        <p>Track Name</p>
      </div>
      <div className=" ml-1 basis-1/4 ">
        <p>Artist Name</p>
      </div>
      <div className=" ml-1 basis-1/4">
        <p>Album Name</p>
      </div>
      <div className=" ml-1 basis-1/4">
        <p>Number of Listens</p>
      </div>
    </div>
    <Pagination
      totalCount={filteredTracks.length}
      pageSize={10}
      data={filteredTracks}
      ItemComponent={PlaylistTracks}
      songCounts={songCounts}
    />
  </>
);
