import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { FaThLarge } from "react-icons/fa";


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

        <div className="gap-5 text-white font-semibold hidden sm:flex">
          <Link to="/">Home</Link>
          <Link to="/card">Card</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={handleLogout} className="cursor-pointer">Log Out</button>
        </div>

        <div className="flex sm:hidden">
          <button className="text-white font-semibold">
            {isOpen ? (
              <i
                className="fa-solid text-2xl fa-xmark"
                onClick={() => setIsOpen(!isOpen)}
              ></i>
            ) : (
              <i
                className="fa-solid text-2xl fa-bars"
                onClick={() => setIsOpen(!isOpen)}
              ></i>
            )}
          </button>
        </div>
        <div
          className={`absolute top-20 right-0 bg-blue-500 w-full sm:w-auto sm:static sm:hidden sm:items-center sm:gap-5 text-white font-semibold ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="h-10 content-center text-center border-b border-blue-50">
            <Link to="/">Home</Link>
          </div>
          <div className="h-10 content-center text-center border-b border-blue-50">
            <Link to="/profile">Profile</Link>
          </div>
          <div className="h-10 content-center text-center border-b border-blue-50">
            <Link to="/card">Card</Link>
          </div>
        </div>
      </div>
      {/* <Outlet /> */}
    </>
  );
};

export default Navbar;
