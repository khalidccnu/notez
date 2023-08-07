import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useFormik } from "formik";
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
  const [categories, setCategories] = useState([]);
  const formik = useFormik({
    initialValues: {
      category: "",
    },
  });

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
          .get(
            `/self/notes/${user.uid}?category=${formik.values.category}&count=true`
          )
          .then((response) =>
            setPageCount(Math.ceil(response.data.total / notesPerPage))
          );
      }
    },
    [formik.values.category, user, isReload]
  );

  useEffect(
    (_) => {
      if (user) {
        axiosIns
          .get(
            `/self/notes/${user.uid}?category=${formik.values.category}&page=${currentPage}&limit=${notesPerPage}`
          )
          .then((response) => {
            setNotes(response.data);
            setLoading(false);
          });
      }
    },
    [formik.values.category, currentPage, user, isReload]
  );

  useEffect(
    (_) => {
      if (user) {
        axiosIns
          .get(`/self/categories/${user.uid}`)
          .then((response) => setCategories(response.data));
      }
    },
    [user]
  );

  return (
    <section className={`my-10`}>
      <div className="container">
        <div className={`w-36 ms-auto`}>
          <select
            name="category"
            className="select select-sm select-bordered rounded-lg w-full focus:outline-0"
            value={formik.values.category}
            onChange={formik.handleChange}
          >
            <option value="all" selected>
              All
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {!isLoading ? (
          notes.length ? (
            <>
              <ul className={`grid grid-cols-1 gap-4 max-w-xl mx-auto mt-4`}>
                {notes.map((note) => (
                  <Note
                    key={note._id}
                    handleDeleteNote={handleDeleteNote}
                    note={note}
                  />
                ))}
              </ul>
              {pageCount > 1 ? (
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
              ) : null}
            </>
          ) : (
            <div className="alert max-w-xl mx-auto mt-4 rounded-lg">
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
