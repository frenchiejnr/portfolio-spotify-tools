import HomePage from "@/components/Homepage";
import { RouteObject, useRoutes } from "react-router";

export const AppRoutes = () => {
  const commonRoutes: RouteObject[] = [{ path: "/", element: <HomePage /> }];
  return [...commonRoutes];
};
