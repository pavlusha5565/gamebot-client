import React from "react";
import { Outlet } from "react-router";
import { Header } from "../../components/Header/Header";
import s from "./Layouts.module.scss";

export function DefaultLayout(): JSX.Element {
  return (
    <>
      <Header />
      <div className={s.DefaultLayout}>
        <Outlet />
      </div>
    </>
  );
}

export function EmptyLayout(): JSX.Element {
  return <Outlet />;
}
