import HomePage from "@/components/Homepage";
import { RouteObject } from "react-router-dom";
import { ProtectedRoutes } from "./protected";

export const AppRoutes = () => {
  const commonRoutes: RouteObject[] = [{ path: "/", element: <HomePage /> }];
  return [...commonRoutes, ...ProtectedRoutes];
};
