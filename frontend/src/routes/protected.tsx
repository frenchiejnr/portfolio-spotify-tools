import Playlist from "@/features/spotify-playlists/components/Playlist";
import Playlists from "@/features/spotify-playlists/components/Playlists";

import { Outlet, RouteObject } from "react-router-dom";
import { fetchPlaylist } from "./fetchPlaylist";
import { Suspense } from "react";
import { TrackPage } from "@/features/spotify-playlists/components/TrackPage";
import { ArtistPage } from "@/features/spotify-playlists/components/ArtistPage";
import { AlbumPage } from "@/features/spotify-playlists/components/AlbumPage";
import { AlbumsList } from "@/features/listens/components/AlbumsList";
import { ArtistsList } from "@/features/listens/components/ArtistsList";
import { TracksList } from "@/features/listens/components/TracksList";

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
      {
        path: "/album/:albumId",
        element: (
          <Suspense fallback={<div>Loading Album...</div>}>
            <AlbumPage />
          </Suspense>
        ),
      },
      {
        path: "/album",
        element: (
          <Suspense fallback={<div>Loading Albums...</div>}>
            <AlbumsList refresh={false} />
          </Suspense>
        ),
      },
      {
        path: "/artist",
        element: (
          <Suspense fallback={<div>Loading Artists...</div>}>
            <ArtistsList refresh={false} />
          </Suspense>
        ),
      },
      {
        path: "/track",
        element: (
          <Suspense fallback={<div>Loading Tracks...</div>}>
            <TracksList refresh={false} />
          </Suspense>
        ),
      },
    ],
  },
];
