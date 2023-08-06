import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

const Note = ({ handleDeleteNote, note }) => {
  const { _id, title } = note;
  const navigate = useNavigate();

  return (
    <li className={`group relative bg-white px-5 py-3 rounded-lg`}>
      <span className={`font-medium`}>{title}</span>
      <span
        className={`absolute top-1/2 -translate-y-1/2 right-5 flex bg-gray-100 opacity-0 group-hover:opacity-100 p-2 rounded-lg text-xs space-x-2 transition-opacity duration-500`}
      >
        <FaEye
          className={`text-mordant-red hover:text-barn-red cursor-pointer`}
          onClick={(_) => navigate("/view-note/" + _id)}
        />
        <FaEdit
          className={`text-mordant-red hover:text-barn-red cursor-pointer`}
          onClick={(_) => navigate("/edit-note/" + _id)}
        />
        <FaTrash
          className={`text-mordant-red hover:text-barn-red cursor-pointer`}
          onClick={(_) => handleDeleteNote(_id)}
        />
      </span>
    </li>
  );
};

export default Note;
