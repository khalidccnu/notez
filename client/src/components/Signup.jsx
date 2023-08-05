import React from "react";
import { useFormik } from "formik";
import { FaUpload } from "react-icons/fa";

// check sign-up form validation
const validateForm = (values) => {
  const errors = {};

  // full name validation
  if (!values.fullName) errors.fullName = "Required";
  else if (values.fullName.length > 20)
    errors.fullName = "Must be 20 characters or less";

  // phone validation
  if (!values.phone) errors.phone = "Required";
  else if (isNaN(values.phone)) errors.phone = "Must be numbers";
  else if (values.phone.length !== 10) errors.phone = "Must be 10 numbers";

  // email validation
  if (!values.email) errors.email = "Required";
  else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email))
    errors.email = "Invalid email address";

  // password validation
  if (!values.password) errors.password = "Required";
  else if (values.password.length < 8)
    errors.password = "Must be 8 characters or up";

  // user image validation
  if (!values.userImg) errors.userImg = "Required";

  return errors;
};

const Signup = () => {
  const formik = useFormik({
    initialValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
      userImg: null,
    },
    validate: validateForm,
    onSubmit: (values) => {},
  });

  return (
    <div className="modal-box max-w-sm">
      <div className={`flex justify-between items-center`}>
        <div>
          <h3 className="font-bold text-lg">Sign Up</h3>
          <p className="text-gray-500">It's quick and easy.</p>
        </div>
        {/* close modal */}
        <form method="dialog">
          <button className="btn focus:outline-0">Close</button>
        </form>
      </div>
      {/* sign-up form */}
      <form
        onSubmit={formik.handleSubmit}
        className="form-control grid grid-cols-1 gap-4 mt-5"
      >
        {/* full name box */}
        <div className="flex flex-col gap-0.5">
          <input
            type="text"
            placeholder="Full name"
            name="fullName"
            className="input input-sm input-bordered rounded w-full focus:outline-0"
            value={formik.values.fullName}
            onChange={formik.handleChange}
          />
          {formik.errors.fullName ? (
            <small className="text-red-600 ml-0.5">
              {formik.errors.fullName}
            </small>
          ) : null}
        </div>
        {/* phone box */}
        <div className="flex flex-col gap-0.5">
          <div className="join">
            <span className="join-item input input-sm input-bordered rounded-l">
              +880
            </span>
            <input
              type="text"
              placeholder="1711223344"
              name="phone"
              className="join-item input input-sm input-bordered rounded-r w-full focus:outline-0"
              value={formik.values.phone}
              onChange={formik.handleChange}
            />
          </div>
          {formik.errors.phone ? (
            <small className="text-red-600 ml-0.5">{formik.errors.phone}</small>
          ) : null}
        </div>
        {/* email box */}
        <div className="flex flex-col gap-0.5">
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="input input-sm input-bordered rounded w-full focus:outline-0"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          {formik.errors.email ? (
            <small className="text-red-600 ml-0.5">{formik.errors.email}</small>
          ) : null}
        </div>
        {/* password box */}
        <div className="flex flex-col gap-0.5">
          <input
            type="password"
            placeholder="New password"
            name="password"
            className="input input-sm input-bordered rounded w-full focus:outline-0"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {formik.errors.password ? (
            <small className="text-red-600 ml-0.5">
              {formik.errors.password}
            </small>
          ) : null}
        </div>
        {/* profile image box */}
        <div>
          <input
            type="file"
            name="userImg"
            id="userImg"
            className="hidden"
            accept="image/*"
            onChange={(e) =>
              formik.setFieldValue("userImg", e.currentTarget.files[0])
            }
          />
          <label
            htmlFor="userImg"
            className="btn btn-sm rounded w-full normal-case"
          >
            {formik.values.userImg ? (
              formik.values.userImg.name.substring(
                0,
                formik.values.userImg.name.lastIndexOf(".")
              )
            ) : (
              <>
                <span>Choose Profile Photo</span>
                <FaUpload />
              </>
            )}
          </label>
          {formik.errors.userImg ? (
            <small className="text-red-600 ml-0.5">
              {formik.errors.userImg}
            </small>
          ) : null}
        </div>
        {/* form submit button */}
        <button
          type="submit"
          className="btn btn-sm w-full bg-barn-red hover:bg-transparent text-white hover:text-barn-red !border-barn-red rounded normal-case"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
