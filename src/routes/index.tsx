import React from "react";
import { RouteObject, useRoutes } from "react-router";
import { DefaultLayout } from "./Layouts/DefaultLayout";
import IndexPage from "./IndexPage/IndexPage";

export const Routes: RouteObject[] = [
  {
    path: "/",
    element: <DefaultLayout />,
    children: [{ index: true, element: <IndexPage /> }],
  },
];

function AppRoutes(): JSX.Element {
  const element = useRoutes(Routes);
  return <>{element}</>;
}

export default AppRoutes;
