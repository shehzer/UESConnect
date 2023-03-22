import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";

export default function LikeButton( {name} ) {
  const [isLiked, setIsLiked] = useState(
    //State to track if user has liked the image
    localStorage.getItem(String(name)) === "true" //sets the localStorage key to the index of the image
  );

  React.useEffect(() => {
    //retrieve saved likes from local storage when a page reloads
    localStorage.setItem(String(name), isLiked);
    
  }, [isLiked]);

  const handleLike = (event) => {
    //sets isLiked to the opposite of the current isLiked

    event.stopPropagation()
    setIsLiked(!isLiked);
    console.log(name,'fresh press')
  };

  return (
    <div>
      {/* if state isLiked is true than the like button will fill red*/}
      <button
        onClick={handleLike}
        className={` flex justify-center p-2 mr-2 mt-2 text-black hover:text-red-400 ${
          isLiked && "text-red-600 text-4xl"
        } bg-none`}
      >
          <FaHeart className="text-2xl" />    
      </button>
    </div>
  );
}