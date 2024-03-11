import { AppRoutes } from "@/routes";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
const router = createBrowserRouter([...AppRoutes()]);

export const AppProvider = () => {
  return <RouterProvider router={router} />;
};
