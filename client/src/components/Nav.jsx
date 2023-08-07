import React, { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IKImage } from "imagekitio-react";
import { FaPlus } from "react-icons/fa";
import useAuth from "../hooks/useAuth.js";
import NewCategory from "./NewCategory.jsx";

const Nav = () => {
  const { user, logOut } = useAuth();
  const { photoURL } = user ?? {};
  const navigate = useNavigate();
  const closeModalRef = useRef(null);
  const [isNewCategory, setNewCategory] = useState(false);

  // sign-out from authentication
  const handleLogout = (_) =>
    logOut()
      .then((_) => sessionStorage.removeItem("_vu"))
      .then((_) => navigate("/"));

  return (
    <nav className={`bg-gray-100`}>
      <div className="container">
        <div className="navbar">
          {/* brand identity */}
          <figure className="flex-1">
            <img src="/lg-notez.png" alt="" className={`w-20`} />
          </figure>
          <div className="flex-none gap-2">
            {/* new content */}
            <div className="form-control">
              <button
                type="button"
                className="btn btn-sm bg-barn-red hover:bg-transparent text-white hover:text-barn-red !border-barn-red rounded normal-case"
                onClick={() => {
                  setNewCategory(false);
                  window.new_modal.showModal();
                }}
              >
                <FaPlus />
                <span>New</span>
              </button>
            </div>
            {/* nav links */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <figure className="w-10 rounded-full overflow-hidden">
                  <IKImage
                    path={photoURL}
                    className="w-full h-full object-cover"
                    transformation={[{ q: "40" }]}
                  />
                </figure>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      "!bg-transparent transition-colors duration-500 " +
                      (isActive
                        ? "text-mordant-red hover:text-barn-red"
                        : "hover:text-barn-red")
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/favourites"
                    className={({ isActive }) =>
                      "!bg-transparent transition-colors duration-500 " +
                      (isActive
                        ? "text-mordant-red hover:text-barn-red"
                        : "hover:text-barn-red")
                    }
                  >
                    Favourites
                  </NavLink>
                </li>
                <li>
                  <span
                    className={`!bg-transparent hover:text-barn-red transition-colors duration-500`}
                    onClick={handleLogout}
                  >
                    Sign Out
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* new content modal */}
        <dialog id="new_modal" className="modal">
          <div className="modal-box max-w-sm">
            {/* modal title */}
            <div className={`flex justify-between items-center`}>
              <div>
                <h3 className="font-bold text-lg">
                  {isNewCategory ? "New Category" : "Create New"}
                </h3>
                <p className="text-gray-500">It's quick and easy.</p>
              </div>
              {/* close modal */}
              <form method="dialog">
                <button className="btn focus:outline-0" ref={closeModalRef}>
                  Close
                </button>
              </form>
            </div>
            {isNewCategory ? (
              <NewCategory />
            ) : (
              <div className={`grid grid-cols-2 gap-3 mt-5`}>
                <button
                  type="button"
                  className="btn btn-sm bg-barn-red hover:bg-transparent text-white hover:text-barn-red !border-barn-red rounded normal-case"
                  onClick={(_) => setNewCategory(true)}
                >
                  <FaPlus />
                  <span>Category</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm bg-barn-red hover:bg-transparent text-white hover:text-barn-red !border-barn-red rounded normal-case"
                  onClick={(_) => {
                    closeModalRef.current.click();
                    navigate("/new-note");
                  }}
                >
                  <FaPlus />
                  <span>Note</span>
                </button>
              </div>
            )}
          </div>
        </dialog>
      </div>
    </nav>
  );
};

export default Nav;
