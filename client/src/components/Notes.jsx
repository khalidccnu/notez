import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import ReactPaginate from "react-paginate";
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
  const [notesPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

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

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  useEffect(
    (_) => {
      if (user) {
        axiosIns
          .get(`/self/notes/${user.uid}?count=true`)
          .then((response) =>
            setPageCount(Math.ceil(response.data.total / notesPerPage))
          );
      }
    },
    [user, isReload]
  );

  useEffect(
    (_) => {
      if (user) {
        axiosIns
          .get(
            `/self/notes/${user.uid}?page=${currentPage}&limit=${notesPerPage}`
          )
          .then((response) => {
            setNotes(response.data);
            setLoading(false);
          });
      }
    },
    [currentPage, user, isReload]
  );

  return (
    <section className={`my-10`}>
      <div className="container">
        {!isLoading ? (
          notes.length ? (
            <>
              <ul className={`grid grid-cols-1 gap-4 max-w-xl mx-auto`}>
                {notes.map((note) => (
                  <Note
                    key={note._id}
                    handleDeleteNote={handleDeleteNote}
                    note={note}
                  />
                ))}
              </ul>
              <div className="flex justify-center mt-5">
                <ReactPaginate
                  containerClassName="join"
                  pageLinkClassName="join-item btn btn-sm"
                  activeLinkClassName="btn-active"
                  disabledLinkClassName="btn-disabled"
                  previousLinkClassName="join-item btn btn-sm"
                  nextLinkClassName="join-item btn btn-sm"
                  breakLinkClassName="join-item btn btn-sm"
                  previousLabel="<"
                  nextLabel=">"
                  breakLabel="..."
                  pageCount={pageCount}
                  pageRangeDisplayed={2}
                  marginPagesDisplayed={2}
                  onPageChange={handlePageClick}
                  renderOnZeroPageCount={null}
                />
              </div>
            </>
          ) : (
            <div className="alert max-w-xl mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-info shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>You have not any note!</span>
            </div>
          )
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

export default Notes;
