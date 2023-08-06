import React, { useEffect, useState } from "react";
import useAxiosIns from "../hooks/useAxiosIns.js";
import useAuth from "../hooks/useAuth.js";
import Note from "./Note.jsx";

const Notes = () => {
  const { user } = useAuth();
  const axiosIns = useAxiosIns();
  const [isLoading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);

  useEffect(
    (_) => {
      if (user) {
        axiosIns.get(`/self/notes/${user.uid}`).then((response) => {
          setNotes(response.data);
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
          <ul className={`grid grid-cols-1 gap-4 max-w-xl mx-auto`}>
            {notes.length
              ? notes.map((note) => <Note key={note._id} note={note} />)
              : null}
          </ul>
        ) : null}
      </div>
    </section>
  );
};

export default Notes;
