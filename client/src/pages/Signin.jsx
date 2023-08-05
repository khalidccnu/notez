import React from "react";
import { useFormik } from "formik";
import { FaGoogle } from "react-icons/fa";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth.js";
import Signup from "../components/Signup.jsx";

const Signin = () => {
  const { isUserLoading, setUserLoading, signInWithEP, signInWithGoogle } =
    useAuth();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      const { email, password } = values;

      // check empty email or password
      if (email === "" || password === "") {
        toast.error("All fields are required!");
        return false;
      }

      signInWithEP(email, password).catch((err) => {
        setUserLoading(false);

        if (err.message === "Firebase: Error (auth/wrong-password).")
          toast.error("Incorrect password!");
        else if (err.message === "Firebase: Error (auth/user-not-found).")
          toast.error("User not found!");
      });
    },
  });

  // sign-in by google
  const handleSigninWithGoogle = (_) => {
    signInWithGoogle().catch((_) => setUserLoading(false));
  };

  return (
    <section>
      <div className="container">
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-7 items-center py-10 sm:py-24`}
        >
          {/* brand identity */}
          <div className={`max-w-sm mx-auto`}>
            {/* brand logo */}
            <figure className={`w-full sm:w-72`}>
              <img src="/lg-notez.png" alt="travelago" />
            </figure>
            {/* brand description */}
            <h1
              className={`text-xl font-semibold text-center sm:text-start mt-4`}
            >
              Notez is a note organizer app to help stay organized and manage
              day-to-day.
            </h1>
          </div>
          {/* sign-in form */}
          <div className="card sm:max-w-sm sm:mx-auto bg-base-100 shadow-2xl">
            <div className="card-body">
              <form
                className="form-control gap-y-4"
                onSubmit={formik.handleSubmit}
              >
                {/* email input box */}
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  className="input input-sm bg-transparent text-barn-red w-full px-0 border-0 border-b border-b-barn-red rounded-none focus:outline-0"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
                {/* password input box */}
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  className="input input-sm bg-transparent text-barn-red w-full px-0 border-0 border-b border-b-barn-red rounded-none focus:outline-0"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
                {/* form submit button */}
                <button
                  type="submit"
                  className="btn btn-sm w-full bg-barn-red hover:bg-transparent text-white hover:text-barn-red !border-barn-red rounded normal-case"
                >
                  <span>SignIn</span>
                  {isUserLoading ? (
                    <span
                      className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"
                      role="status"
                    ></span>
                  ) : null}
                </button>
                {/* new user sign-up modal invoke */}
                <div className="flex flex-col lg:flex-row lg:justify-center lg:space-x-2">
                  <span>New to Notez?</span>
                  <span
                    className="text-mordant-red hover:text-barn-red w-fit cursor-pointer transition-colors duration-500"
                    onClick={() => window.signup_modal.showModal()}
                  >
                    Create New Account
                  </span>
                </div>
                <div className="divider">or</div>
                {/* google authentication method */}
                <div
                  className="flex justify-center items-center p-2 border hover:text-barn-red hover:border-barn-red cursor-pointer space-x-2 transition-colors duration-500"
                  onClick={handleSigninWithGoogle}
                >
                  <FaGoogle className="text-xl" />
                  <span>Continue with Google</span>
                </div>
              </form>
            </div>
          </div>
          {/* new user sign-up modal declaration */}
          <dialog id="signup_modal" className="modal">
            <Signup />
          </dialog>
        </div>
      </div>
    </section>
  );
};

export default Signin;
