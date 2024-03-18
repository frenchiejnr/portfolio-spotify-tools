import Playlist from "@/features/spotify-playlists/components/Playlist";
import Playlists from "@/features/spotify-playlists/components/Playlists";

import { Outlet, RouteObject } from "react-router-dom";
import { fetchPlaylist } from "./fetchPlaylist";
import { Suspense } from "react";
import { TrackPage } from "@/features/spotify-playlists/components/TrackPage";
import { ArtistPage } from "@/features/spotify-playlists/components/ArtistPage";

export const ProtectedRoute = () => {
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
        element: (
          <Suspense fallback={<div>Loading playlist...</div>}>
            <Playlist />
          </Suspense>
        ),
        loader: fetchPlaylist,
      },
      {
        path: "/track/:trackId",
        element: (
          <Suspense fallback={<div>Loading Track...</div>}>
            <TrackPage />
          </Suspense>
        ),
      },
      {
        path: "/artist/:artistId",
        element: (
          <Suspense fallback={<div>Loading Artist...</div>}>
            <ArtistPage />
          </Suspense>
        ),
      },
    ],
  },
];
