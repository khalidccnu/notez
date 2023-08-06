import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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

const EditNote = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosIns = useAxiosIns();
  const [isLoading, setLoading] = useState(true);
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

      if (
        !description ||
        (description.indexOf("<p><br></p>") === 0 && description.length === 11)
      )
        noteDes = null;
      else noteDes = description;

      axiosIns
        .put(`/self/notes/${user.uid}/${id}`, {
          title: values.title,
          description: noteDes,
          category_id: values.category,
        })
        .then((_) => toast.success("Note updated!"))
        .catch((_) => toast.error("Something went wrong!"));
    },
  });

  // handle quill contents
  const handleQuillChange = (content, delta, source, editor) => {
    if (source === "user") setDescription(editor.getHTML());
  };

  useEffect(() => {
    if (quillRef.current) {
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
    }
  }, [quillRef.current]);

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

  useEffect(
    (_) => {
      if (user) {
        axiosIns.get(`/self/notes/${user.uid}/${id}`).then((response) => {
          formik.setValues({
            title: response.data.title,
            category: response.data.category_id,
          });

          setDescription(response.data.description);
          setLoading(false);
        });
      }
    },
    [user]
  );

  return (
    <section className={`my-10`}>
      <div className="container">
        {!isLoading ? (
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
                {categories.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                    selected={
                      formik.values.category === category._id
                        ? "selected"
                        : null
                    }
                  >
                    {category.name}
                  </option>
                ))}
              </select>
              {/* note insert button */}
              <button
                type="submit"
                className="btn btn-sm w-full bg-barn-red hover:bg-transparent text-white hover:text-barn-red !border-barn-red rounded normal-case"
              >
                Update
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </section>
  );
};

export default EditNote;
