import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "./useAuth.js";

const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const useAxiosIns = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(
    (_) => {
      // handle axios request
      axiosIns.interceptors.request.use((config) => {
        const token = localStorage.getItem("_at");

        if (token) config.headers.Authorization = `Bearer ${token}`;

        return config;
      });

      // handle axios response
      axiosIns.interceptors.response.use(
        (res) => res,
        (err) => {
          if (err.response && [401, 403].includes(err.response.status))
            logOut().then((_) => navigate("/"));

          return Promise.reject(err);
        }
      );
    },
    [logOut, navigate, axiosIns]
  );

  return axiosIns;
};

export default useAxiosIns;
