import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import toast from "react-hot-toast";
import useAxiosIns from "../hooks/useAxiosIns.js";
import useAuth from "../hooks/useAuth.js";
import Category from "./Category.jsx";
import EditCategory from "./EditCategory.jsx";

const Categories = () => {
  const { user } = useAuth();
  const axiosIns = useAxiosIns();
  const [isLoading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isReload, setReload] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  // delete category
  const handleDeleteCategory = (id) => {
    axiosIns
      .delete(`/self/categories/${user.uid}/${id}`)
      .then((_) => {
        toast.success("Category deleted!");
        setReload(!isReload);
      })
      .catch((_) => toast.error("Something went wrong!"));
  };

  useEffect(
    (_) => {
      if (editCategory) window.edit_modal.showModal();
    },
    [editCategory]
  );

  useEffect(
    (_) => {
      if (user) {
        axiosIns.get(`/self/categories/${user.uid}`).then((response) => {
          setCategories(response.data);
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
          categories.length ? (
            <>
              <ul
                className={`grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm sm:max-w-xl mx-auto`}
              >
                {categories.map((category) => (
                  <Category
                    key={category._id}
                    setEditCategory={setEditCategory}
                    handleDeleteCategory={handleDeleteCategory}
                    category={category}
                  />
                ))}
              </ul>
              {/* edit modal */}
              <dialog id="edit_modal" className="modal">
                <div className="modal-box max-w-sm">
                  {/* modal title */}
                  <div className={`flex justify-between items-center`}>
                    <div>
                      <h3 className="font-bold text-lg">Edit</h3>
                      <p className="text-gray-500">It's quick and easy.</p>
                    </div>
                    {/* close modal */}
                    <form method="dialog">
                      <button className="btn focus:outline-0">Close</button>
                    </form>
                  </div>
                  <EditCategory editCategory={editCategory} />
                </div>
              </dialog>
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
              <span>You have not any category!</span>
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

export default Categories;
