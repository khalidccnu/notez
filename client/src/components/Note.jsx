import React from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

const Note = ({ note }) => {
  const { title } = note;

  return (
    <li className={`group relative bg-white px-5 py-3 rounded-lg`}>
      <span className={`font-medium`}>{title}</span>
      <span
        className={`absolute top-1/2 -translate-y-1/2 right-5 flex opacity-0 group-hover:opacity-100 text-xs space-x-2 transition-opacity duration-500`}
      >
        <FaEye
          className={`text-mordant-red hover:text-barn-red cursor-pointer`}
        />
        <FaEdit
          className={`text-mordant-red hover:text-barn-red cursor-pointer`}
        />
        <FaTrash
          className={`text-mordant-red hover:text-barn-red cursor-pointer`}
        />
      </span>
    </li>
  );
};

export default Note;
