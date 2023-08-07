import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";

const Note = ({ handleFavouriteNote, handleDeleteNote, note }) => {
  const { _id, title, favourite } = note;
  const navigate = useNavigate();

  return (
    <li className={`group relative bg-white px-5 py-3 rounded-lg`}>
      <h3
        className={`font-medium hover:text-black-bean cursor-pointer`}
        onClick={(_) => navigate("/view-note/" + _id)}
      >
        {title}
      </h3>
      <span
        className={`absolute top-1/2 -translate-y-1/2 right-5 flex bg-gray-100 opacity-0 group-hover:opacity-100 p-2 rounded-lg text-xs space-x-2 transition-opacity duration-500`}
      >
        {favourite ? (
          <FaHeart
            className={`text-mordant-red hover:text-barn-red cursor-pointer`}
            onClick={(_) => handleFavouriteNote({ method: "remove", _id })}
          />
        ) : (
          <FaRegHeart
            className={`text-mordant-red hover:text-barn-red cursor-pointer`}
            onClick={(_) => handleFavouriteNote({ method: "add", _id })}
          />
        )}
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
