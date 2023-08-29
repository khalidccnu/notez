import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import useAxiosIns from "../hooks/useAxiosIns.js";

// check new category form validation
const validateForm = (values) => {
  const errors = {};

  // category name validation
  if (!values.name) errors.name = "Required";
  else if (values.name.length > 20)
    errors.name = "Must be 20 characters or less";

  return errors;
};

const NewCategory = () => {
  const { user } = useSelector((state) => state.authSlice);
  const axiosIns = useAxiosIns();
  const [status, setStatus] = useState(null);
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validate: validateForm,
    onSubmit: async (values, formikHelpers) => {
      await axiosIns
        .post(`/categories`, {
          name: values.name,
          owner_id: user.uid,
        })
        .then((_) =>
          setStatus({ status: "success", message: "New category inserted!" })
        )
        .then((_) => formikHelpers.resetForm())
        .catch((_) =>
          setStatus({ status: "error", message: "Something went wrong!" })
        );

      setInterval((_) => {
        setStatus(null);
      }, 3000);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="form-control grid grid-cols-1 gap-3 mt-5"
    >
      {status ? (
        <span
          className={
            status.status === "success" ? "text-green-600" : "text-red-600"
          }
        >
          {status.message}
        </span>
      ) : null}
      {/* full name box */}
      <div className="flex flex-col gap-0.5">
        <input
          type="text"
          placeholder="Name"
          name="name"
          className="input input-sm input-bordered rounded w-full focus:outline-0"
          value={formik.values.name}
          onChange={formik.handleChange}
        />
        {formik.errors.name ? (
          <small className="text-red-600 ml-0.5">{formik.errors.name}</small>
        ) : null}
      </div>
      {/* form submit button */}
      <button
        type="submit"
        className="btn btn-sm w-full bg-barn-red hover:bg-transparent text-white hover:text-barn-red !border-barn-red rounded normal-case"
      >
        Create
      </button>
    </form>
  );
};

export default NewCategory;
