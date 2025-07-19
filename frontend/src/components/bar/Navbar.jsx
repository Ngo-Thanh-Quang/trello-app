import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { FaThLarge, FaRegArrowAltCircleRight } from "react-icons/fa";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("tokenLogin");
    window.location.reload();
  };

  return (
    <>
      <div className="h-20 bg-blue-500 place-content-between items-center flex md:px-10 px-5 shadow-md fixed top-0 left-0 right-0 z-50">
         <div className="flex items-center gap-2 px-6 py-5 font-bold text-xl border-b border-blue-500 text-white">
                <FaThLarge className="text-2xl" />
                <Link to="/">Trello App</Link>
              </div>

        <div className="gap-5 text-white font-semibold">
          <button onClick={handleLogout} className="px-4 py-2 bg-white text-blue-700 rounded-md font-bold hover:bg-gray-300 transition cursor-pointer hidden md:block">Log Out</button>
        </div>

      </div>
      {/* <Outlet /> */}
    </>
  );
};

export default Navbar;
