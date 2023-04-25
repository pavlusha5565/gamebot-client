import React from "react";
import { RouteObject, useRoutes } from "react-router";
import { DefaultLayout } from "./Layouts/DefaultLayout";
import IndexPage from "./IndexPage/IndexPage";
import LoginPage from "./LoginPage/LoginPage";

export const Routes: RouteObject[] = [
  {
    path: "/",
    element: <DefaultLayout />,
    children: [{ index: true, element: <IndexPage /> }],
  },
  {
    path: "/login",
    element: <DefaultLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
];

function AppRoutes(): JSX.Element {
  const element = useRoutes(Routes);
  return <>{element}</>;
}

export default AppRoutes;
