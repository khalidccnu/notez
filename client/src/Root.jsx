import React from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Nav from "./components/Nav.jsx";

const Root = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/" ? <Nav /> : null}
      <Outlet />
      <Toaster />
      <ScrollRestoration />
    </>
  );
};

export default Root;
