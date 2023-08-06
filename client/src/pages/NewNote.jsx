import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import TextareaAutosize from "react-textarea-autosize";
import ReactQuill from "react-quill";
import toast from "react-hot-toast";
import useAxiosIns from "../hooks/useAxiosIns.js";
import useAuth from "../hooks/useAuth.js";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
  ],
};

const NewNote = () => {
  const { user } = useAuth();
  const axiosIns = useAxiosIns();
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const formik = useFormik({
    initialValues: {
      title: "",
      category: "",
    },
    onSubmit: (values, formikHelpers) => {
      if (!values.title) {
        toast.error("Note title is required!");
        return false;
      } else if (!values.category) {
        toast.error("Note category is required!");
        return false;
      }

      let noteDes;

      if (
        !description ||
        (description.indexOf("<p><br></p>") === 0 && description.length === 11)
      )
        noteDes = null;
      else noteDes = description;

      axiosIns
        .post(`/notes`, {
          title: values.title,
          description: noteDes,
          category_id: values.category,
          owner_id: user.uid,
        })
        .then((_) => toast.success("New note inserted!"))
        .then((_) => {
          formikHelpers.resetForm();
          setDescription("");
        })
        .catch((_) => toast.error("Something went wrong!"));
    },
  });

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
        <form
          onSubmit={formik.handleSubmit}
          className="form-control grid grid-cols-1 gap-4 mt-5 max-w-xl mx-auto"
        >
          {/* note title */}
          <TextareaAutosize
            placeholder="Write your note title..."
            name="title"
            className={`textarea textarea-sm textarea-bordered rounded w-full min-h-0 focus:outline-0 resize-none leading-relaxed`}
            value={formik.values.title}
            onChange={formik.handleChange}
            autoFocus={true}
          />
          {/* note description */}
          <ReactQuill
            placeholder="Explain your note..."
            theme="snow"
            modules={modules}
            value={description}
            onChange={setDescription}
          />
          <div className={`grid grid-cols-2 gap-3`}>
            {/* note category */}
            <select
              name="category"
              className="select select-sm select-bordered rounded w-full focus:outline-0"
              value={formik.values.category}
              onChange={formik.handleChange}
            >
              <option value="" disabled selected>
                Category
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {/* note insert button */}
            <button
              type="submit"
              className="btn btn-sm w-full bg-barn-red hover:bg-transparent text-white hover:text-barn-red !border-barn-red rounded normal-case"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewNote;
