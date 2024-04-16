import Pagination from "@/components/Pagination";
import { PlaylistTracks } from "./PlaylistTracks";

export const PlaylistTracksTable: React.FC<{
  filteredTracks: SpotifyApi.PlaylistTrackObject[];
  songCounts: {};
}> = ({ filteredTracks, songCounts }) => (
  <>
    <div className="mx-auto hidden w-full  items-start justify-between font-bold md:flex">
      <div className="mx-auto flex basis-5/6 flex-row justify-between text-center ">
        <div className=" ml-1 basis-1/3">
          <p>Track Name</p>
        </div>
        <div className=" ml-1 basis-1/3 ">
          <p>Artist Name</p>
        </div>
        <div className=" ml-1 basis-1/3">
          <p>Album Name</p>
        </div>
      </div>
      <div className=" ml-1">
        <p>Plays</p>
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
