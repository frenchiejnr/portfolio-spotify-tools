import { Link } from "react-router-dom";

export const LinkBar: React.FC = () => (
  <div className="bg-indigo-300 p-1 pt-0">
    <div className="flex justify-around">
      <Link
        to={"/"}
        className="mt-1 rounded-md bg-gray-200 px-2 text-left shadow hover:bg-gray-100"
      >
        Home
      </Link>
      <Link
        to={"/playlists"}
        className="mt-1 rounded-md bg-gray-200 px-2 text-left shadow hover:bg-gray-100"
      >
        Playlists
      </Link>
      <Link
        to={"/album"}
        className="mt-1 rounded-md bg-gray-200 px-2 text-left shadow hover:bg-gray-100"
      >
        Albums
      </Link>
      <Link
        to={"/artist"}
        className="mt-1 rounded-md bg-gray-200 px-2 text-left shadow hover:bg-gray-100"
      >
        Artists
      </Link>
      <Link
        to={"/track"}
        className="mt-1 rounded-md bg-gray-200 px-2 text-left shadow hover:bg-gray-100"
      >
        Tracks
      </Link>
    </div>
  </div>
);
