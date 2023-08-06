import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxiosIns from "../hooks/useAxiosIns.js";
import useAuth from "../hooks/useAuth.js";
import Note from "./Note.jsx";

const Notes = () => {
  const { user } = useAuth();
  const axiosIns = useAxiosIns();
  const [isLoading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [isReload, setReload] = useState(false);

  // delete note
  const handleDeleteNote = (id) => {
    axiosIns
      .delete(`/self/notes/${user.uid}/${id}`)
      .then((_) => {
        toast.success("Note deleted!");
        setReload(!isReload);
      })
      .catch((_) => toast.error("Something went wrong!"));
  };

  useEffect(
    (_) => {
      if (user) {
        axiosIns.get(`/self/notes/${user.uid}`).then((response) => {
          setNotes(response.data);
          setLoading(false);
        });
      }
    },
    [user, isReload]
  );

  return (
    <section className={`my-10`}>
      <div className="container">
        {!isLoading ? (
          <ul className={`grid grid-cols-1 gap-4 max-w-xl mx-auto`}>
            {notes.length
              ? notes.map((note) => (
                  <Note
                    key={note._id}
                    handleDeleteNote={handleDeleteNote}
                    note={note}
                  />
                ))
              : null}
          </ul>
        ) : null}
      </div>
    </section>
  );
};

export default Notes;
