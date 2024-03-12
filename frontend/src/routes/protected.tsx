import Playlist from "@/features/spotify-playlists/components/Playlist";
import Playlists from "@/features/spotify-playlists/components/Playlists";

import { spotify } from "@/lib/spotify";
import { Outlet, RouteObject } from "react-router-dom";

const ProtectedRoute = () => {
  return <Outlet />;
};

export const ProtectedRoutes: RouteObject[] = [
  {
    path: "",
    element: <ProtectedRoute />,
    children: [
      { path: "/playlists", element: <Playlists /> },
      {
        path: "/playlists/:playlistId",
        element: <Playlist />,
        loader: async ({ request, params }) => {
          return spotify.get(`/playlists/${params.playlistId}`, {
            signal: request.signal,
          });
        },
      },
    ],
  },
];
