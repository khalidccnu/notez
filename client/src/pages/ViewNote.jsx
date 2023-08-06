import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import useAxiosIns from "../hooks/useAxiosIns.js";
import useAuth from "../hooks/useAuth.js";

const ViewNote = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosIns = useAxiosIns();
  const [isLoading, setLoading] = useState(true);
  const [note, setNote] = useState({});

  useEffect(
    (_) => {
      if (user) {
        axiosIns.get(`/self/notes/${user.uid}/${id}`).then((response) => {
          setNote(response.data);
          setLoading(false);
        });
      }
    },
    [user]
  );

  return (
    <section className={`my-10`}>
      <div className="container">
        {!isLoading ? (
          <div className={`grid grid-cols-1 gap-4 max-w-xl mx-auto`}>
            <h1 className={`font-semibold text-lg`}>{note.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: note.description }} />
          </div>
        ) : (
          <ThreeDots
            height="80"
            width="80"
            color="#770407"
            wrapperClass="justify-center"
          />
        )}
      </div>
    </section>
  );
};

export default ViewNote;
