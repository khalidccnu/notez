import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Nav from "./components/Nav.jsx";

const Root = () => {
  return (
    <>
      <Nav />
      <Outlet />
      <Toaster />
      <ScrollRestoration />
    </>
  );
};

export default Root;
