import Playlist from "@/features/spotify-playlists/components/Playlist";

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
