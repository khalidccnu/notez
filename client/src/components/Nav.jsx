import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IKImage } from "imagekitio-react";
import { FaPlus } from "react-icons/fa";
import useAuth from "../hooks/useAuth.js";

const Nav = () => {
  const { user, logOut } = useAuth();
  const { photoURL } = user ?? {};
  const navigate = useNavigate();

  // sign-out from authentication
  const handleLogout = (_) => logOut().then((_) => navigate("/"));

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
      </div>
    </nav>
  );
};

export default Nav;
