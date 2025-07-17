import React, { forwardRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTrello,
  FaUser,
  FaPlus,
  FaChevronDown,
  FaChevronUp,
  FaBell,
  FaSignOutAlt,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Sidebar = forwardRef(({
  onLogout,
  boards,
  fetchBoards,
  onSelectBoard,
  selectedBoardId,
  sidebarOpen,
  setSidebarOpen,
  setShowCreate,
}, ref) => {
  const location = useLocation();
  const [showBoards, setShowBoards] = useState(false);
  const [showAllBoards, setShowAllBoards] = useState(false);
  const [newBoard, setNewBoard] = useState({ name: "", description: "" });
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("tokenLogin");
    window.location.reload();
  };

  return (
    <aside
    ref={ref}
      className={`h-screen fixed top-20 left-0 z-10 w-64 bg-gradient-to-b from-blue-500 to-blue-800 text-white flex flex-col shadow-lg transform transition-transform duration-300
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0 md:h-screen`}
    >
      <nav className="flex-1 px-4 py-6">
        <div>
          <button
            className={`flex items-center gap-3 font-semibold px-4 py-3 rounded-lg w-full transition-all ${
              showBoards ? "bg-white/20 font-semibold" : "hover:bg-white/10"
            }`}
            onClick={() => setShowBoards((v) => !v)}
          >
            <FaTrello />
            Boards
            <FaChevronDown
              className={`ml-auto transition-transform ${
                showBoards ? "rotate-180" : ""
              }`}
            />
          </button>

          {showBoards && (
            <div className="ml-8 mt-2">
              <button
                className="flex items-center gap-2 px-2 py-2 text-sm text-blue-100 hover:text-white hover:bg-blue-700 rounded w-full mb-2"
                onClick={() => {
                  setShowCreate(true)
                  setSidebarOpen(!sidebarOpen)
                }}
              >
                <FaPlus /> Create Board
              </button>

              {boards.length === 0 ? (
                <div className="text-xs text-blue-200 px-2 py-1">No Board</div>
              ) : (
                <>
                  {(showAllBoards ? boards : boards.slice(0, 3)).map(
                    (board) => {
                      const isSelected = selectedBoardId === board.id;
                      return (
                        <button
                          key={board.id}
                          onClick={() => {
                            navigate(`/board/${board.id}`)
                            setSidebarOpen(!sidebarOpen)
                          }}
                          className={`block px-2 py-2 rounded text-sm w-full text-left transition-transform transform hover:-translate-y-1 hover:shadow-xl cursor-pointer border group
        ${
          isSelected
            ? "bg-blue-700 text-white font-semibold border-blue-200"
            : "hover:bg-blue-700 hover:border-blue-200 border-transparent"
        }`}
                        >
                          {board.name}
                        </button>
                      );
                    }
                  )}

                  {boards.length > 3 && (
                    <button
                      className="flex items-center gap-2 px-2 py-2 text-blue-100 hover:text-white hover:bg-blue-700 border border-transparent hover:border-amber-100 rounded w-full mb-2"
                      onClick={() => setShowAllBoards((prev) => !prev)}
                    >
                      {showAllBoards ? (
                        <>
                          <FaChevronUp /> Show Less
                        </>
                      ) : (
                        <>
                          <FaChevronDown /> View More
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex font-semibold items-center gap-3 px-4 py-3 rounded-lg w-full transition-all hover:bg-white/10">
          <Link className="flex items-center gap-3 rounded-lg w-full" to="/notifications" onClick={()=>setSidebarOpen(!sidebarOpen)}>
            <FaBell /> Notify
          </Link>
        </div>

        <div className="flex font-semibold items-center gap-3 px-4 py-3 rounded-lg w-full transition-all hover:bg-white/10">
          <Link className="flex items-center gap-3 rounded-lg w-full" to="/profile" onClick={()=>setSidebarOpen(!sidebarOpen)}>
            <FaUser /> Profile
          </Link>
        </div>

        <div className="flex font-semibold items-center gap-3 px-4 py-3 rounded-lg w-full transition-all hover:bg-white/10">
          <button onClick={handleLogout} className="flex items-center md:hidden gap-3 rounded-lg w-full" >
            <FaSignOutAlt /> Log Out
          </button>
        </div>
      </nav>

      
    </aside>
  );
});

export default Sidebar;
