import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const { isUserLoading, user } = useSelector((state) => state.authSlice);
  const location = useLocation();

  return !isUserLoading ? (
    user?.uid ? (
      children
    ) : (
      <Navigate to="/" state={{ fromURL: location }}></Navigate>
    )
  ) : null;
};

export default PrivateRoute;
