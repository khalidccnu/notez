import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Category = ({ setEditCategory, handleDeleteCategory, category }) => {
  const { _id, name } = category;

  return (
    <li className={`group relative bg-white px-5 py-3 rounded-lg`}>
      <span className={`font-medium`}>{name}</span>
      <span
        className={`absolute top-1/2 -translate-y-1/2 right-5 flex bg-gray-100 opacity-0 group-hover:opacity-100 p-2 rounded-lg text-xs space-x-2 transition-opacity duration-500`}
      >
        <FaEdit
          className={`text-mordant-red hover:text-barn-red cursor-pointer`}
          onClick={(_) => setEditCategory({ _id, name })}
        />
        <FaTrash
          className={`text-mordant-red hover:text-barn-red cursor-pointer`}
          onClick={(_) => handleDeleteCategory(_id)}
        />
      </span>
    </li>
  );
};

export default Category;
