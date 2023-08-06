import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Nav from "./components/Nav.jsx";

const Root = () => {
  return (
    <>
      <Nav />
      <Outlet />
      <Toaster />
    </>
  );
};

export default Root;
