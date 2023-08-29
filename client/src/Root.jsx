import React, { useEffect } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebase.config.js";
import { setUser, setUserLoading } from "./redux/auth/authSlice.js";
import Nav from "./components/Nav.jsx";

const Root = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // change state from sign-in to sign-out or vice-versa
    const authChange = onAuthStateChanged(auth, async (userCred) => {
      if (userCred) {
        dispatch(setUser(userCred));

        // get jwt token from server
        await axios
          .post(`${import.meta.env.VITE_API_URL}/jwt`, { _id: userCred.uid })
          .then((response) => localStorage.setItem("_at", response.data))
          .then((_) => sessionStorage.setItem("_vu", JSON.stringify(true)));
      } else {
        dispatch(setUser(null));
        localStorage.removeItem("_at");
      }

      dispatch(setUserLoading(false));
    });

    return () => authChange();
  }, []);

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
