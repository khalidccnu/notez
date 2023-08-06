import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import TextareaAutosize from "react-textarea-autosize";
import ReactQuill from "react-quill";
import toast from "react-hot-toast";
import useAxiosIns from "../hooks/useAxiosIns.js";
import useAuth from "../hooks/useAuth.js";

// quill modules
const modules = {
  toolbar: {
    container: [
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
  },
};

const NewNote = () => {
  const { user } = useAuth();
  const axiosIns = useAxiosIns();
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const quillRef = useRef(null);
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

      if (!description || description === "<p><br></p>") noteDes = null;
      else noteDes = description;

      axiosIns
        .post(`/notes`, {
          title: values.title,
          description: noteDes,
          date: new Date(),
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

  // handle quill contents
  const handleQuillChange = (content, delta, source, editor) => {
    if (source === "user") setDescription(editor.getHTML());
  };

  useEffect(() => {
    const quill = quillRef.current.getEditor();

    // custom image handler for image upload
    const handleImageUpload = (_) => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = (_) => {
        const file = input.files[0];
        const formData = new FormData();
        formData.append("noteImg", file);

        axiosIns.post(`/notes/upload`, formData).then((response) => {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();

          quill.insertEmbed(range.index, "image", response.data.url);
          quill.insertText(range.index + 1, "\n", "user");
          quill.setSelection(range.index + 2);
        });
      };
    };

    quill.getModule("toolbar").addHandler("image", handleImageUpload);

    return () => quill.off("text-change");
  }, []);

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
          className="form-control grid grid-cols-1 gap-4 max-w-xl mx-auto"
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
            modules={{
              toolbar: {
                ...modules.toolbar,
                clipboard: {
                  matchVisual: false,
                },
              },
            }}
            value={description}
            onChange={handleQuillChange}
            ref={quillRef}
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
