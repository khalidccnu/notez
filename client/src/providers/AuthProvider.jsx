import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase.config.js";

// initialize authentication provider
export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [isUserLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState(null);

  // get user authentication from firebase
  const signInWithEP = (email, password) => {
    setUserLoading(true);

    return signInWithEmailAndPassword(auth, email, password);
  };

  // get user google account authentication from firebase
  const signInWithGoogle = (_) => {
    setUserLoading(true);

    return signInWithPopup(auth, googleProvider);
  };

  // create user in firebase
  const createUserWithEP = (values) => {
    setUserLoading(true);

    values.phone = "+880" + values.phone;
    const { fullName, phone, email, password, userImg } = values;

    return createUserWithEmailAndPassword(auth, email, password).then((_) => {
      const formData = new FormData();
      formData.append("userImg", userImg);

      return axios
        .post(`${import.meta.env.VITE_API_URL}/users/upload`, formData)
        .then((response) =>
          updateProfile(auth.currentUser, {
            displayName: fullName,
            photoURL: response.data.filePath,
          })
        );
    });
  };

  // user logout
  const logOut = async (_) => await signOut(auth);

  // initialize authentication info
  const authInfo = {
    isUserLoading,
    setUserLoading,
    user,
    signInWithEP,
    signInWithGoogle,
    createUserWithEP,
    logOut,
  };

  useEffect(() => {
    // change state form sign-in to sign-out or vice-versa
    const authChange = onAuthStateChanged(auth, async (userCred) => {
      if (userCred) {
        setUser(userCred);

        // get jwt token from server
        await axios
          .post(`${import.meta.env.VITE_API_URL}/jwt`, { _id: userCred.uid })
          .then((response) => localStorage.setItem("_at", response.data));
      } else {
        setUser(null);
        localStorage.removeItem("_at");
      }

      setUserLoading(false);
    });

    return () => authChange();
  }, []);

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
