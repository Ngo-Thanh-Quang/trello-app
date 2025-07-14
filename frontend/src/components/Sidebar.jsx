import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTrello, FaUser, FaSignOutAlt, FaThLarge, FaChevronDown, FaPlus } from "react-icons/fa";
import axios from "axios";


const Sidebar = ({ onLogout, boards, fetchBoards, showSuccess, onSelectBoard }) => {
  const location = useLocation();
  const [showBoards, setShowBoards] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newBoard, setNewBoard] = useState({ name: "", description: "" });

  // Tạo board mới
  const handleCreateBoard = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("tokenLogin");
    await axios.post(
      "http://localhost:4000/boards",
      newBoard,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setShowCreate(false);
    setNewBoard({ name: "", description: "" });
    fetchBoards();
    if (showSuccess) showSuccess("Tạo bảng thành công!");
  };

  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white flex flex-col shadow-lg fixed top-20 left-0 z-40">
      <div className="flex items-center gap-2 px-6 py-5 font-bold text-xl border-b border-blue-500">
        <FaThLarge className="text-2xl" />
        Trello App
      </div>
      <nav className="flex-1 px-4 py-6">
        
        <div>
          <button
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all ${showBoards ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`}
            onClick={() => setShowBoards((v) => !v)}
          >
            <FaTrello />
            Boards
            <FaChevronDown className={`ml-auto transition-transform ${showBoards ? "rotate-180" : ""}`} />
          </button>
          {showBoards && (
            <div className="ml-8 mt-2">
              <button
                className="flex items-center gap-2 px-2 py-2 text-sm text-blue-100 hover:text-white hover:bg-blue-700 rounded w-full mb-2"
                onClick={() => setShowCreate(true)}
              >
                <FaPlus /> Create Board
              </button>
              {boards.length === 0 && (
                <div className="text-xs text-blue-200 px-2 py-1">No boards yet</div>
              )}
              {boards.map((board) => (
                <button
                  key={board.id}
                  onClick={() => {
                    if (typeof onSelectBoard === 'function') onSelectBoard(board.id);
                  }}
                  className={`block px-2 py-2 rounded text-sm w-full text-left hover:bg-blue-700 ${
                    location.search.includes(board.id) ? "bg-white/20 font-semibold" : ""
                  }`}
                >
                  {board.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
      <button
        className="flex items-center gap-2 px-6 py-4 border-t border-blue-500 hover:bg-white/10 transition-all"
        onClick={onLogout}
      >
        <FaSignOutAlt />
        Log out
      </button>
      
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <form
            className="bg-white p-6 rounded shadow-md w-96 text-gray-800"
            onSubmit={handleCreateBoard}
          >
            <h2 className="text-xl font-bold mb-4">Create Board</h2>
            <input
              className="w-full mb-3 p-2 border rounded"
              placeholder="Board Name"
              value={newBoard.name}
              onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
              required
            />
            <textarea
              className="w-full mb-3 p-2 border rounded"
              placeholder="Board Description"
              value={newBoard.description}
              onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
};
export default Sidebar;