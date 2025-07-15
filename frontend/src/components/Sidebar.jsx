import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTrello, FaUser, FaSignOutAlt, FaThLarge, FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const Sidebar = ({ onLogout, boards, fetchBoards, onSelectBoard, selectedBoardId }) => {
  const location = useLocation();
  const [showBoards, setShowBoards] = useState(false);
  const [showAllBoards, setShowAllBoards] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newBoard, setNewBoard] = useState({ name: "", description: "" });
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  //Tao bang 
  const handleCreateBoard = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("tokenLogin");

    try {
      const res = await axios.post(
        `${backendUrl}/boards`,
        {
        ...newBoard,
        members: selectedMembers,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Create new board successfully!");
      setShowCreate(false);
      setNewBoard({ name: "", description: "" });
      setSelectedMembers([]);
      fetchBoards();
    } catch (err) {
      console.error("Error creating board:", err);
      toast.error("Failed to create board. Please try again.");
    }
  };

  const fetchUsersToInvite = async () => {
    const token = localStorage.getItem("tokenLogin");
    try {
      const res = await axios.get(`${backendUrl}/auth/invite-list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(res.data);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    }
  };

  const openCreateModal = () => {
    fetchUsersToInvite();
    setShowCreate(true);
  };
  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-blue-500 to-blue-800 text-white flex flex-col shadow-lg fixed top-20 left-0 z-40">


      <nav className="flex-1 px-4 py-6">
        <div>
          <button
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all ${showBoards ? "bg-white/20 font-semibold" : "hover:bg-white/10"
              }`}
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
                onClick={openCreateModal}
              >
                <FaPlus /> Create Board
              </button>

              {boards.length === 0 ? (
                <div className="text-xs text-blue-200 px-2 py-1">No Board</div>
              ) : (
                <>
                  {(showAllBoards ? boards : boards.slice(0, 3)).map((board) => {
                    const isSelected = selectedBoardId === board.id;
                    return (
                      <button
                        key={board.id}
                        onClick={() => onSelectBoard?.(board.id)}
                        className={`block px-2 py-2 rounded text-sm w-full text-left transition-transform transform hover:-translate-y-1 hover:shadow-xl cursor-pointer border group
        ${isSelected ? "bg-blue-700 text-white font-semibold border-blue-200" : "hover:bg-blue-700 hover:border-blue-200 border-transparent"}`}
                      >
                        {board.name}
                      </button>
                    );
                  })}



                  {boards.length > 3 && (
                    <button
                      className="flex items-center gap-2 px-2 py-2 text-sm text-blue-100 hover:text-white hover:bg-blue-700 border border-transparent hover:border-amber-100 rounded w-full mb-2"
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
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all hover:bg-white/10">
          <Link className="flex gap-3 rounded-lg w-full" to="/profile"><FaUser /> Profile</Link>
        </div>
      </nav>


      {/* Modal tao bang */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <form
            className="bg-white p-6 rounded shadow-md w-full max-w-md mx-4 text-gray-800"
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
            <div className="mb-4">
              <label className="font-semibold mb-2 block">Invite Members:</label>
              <div className="max-h-40 overflow-y-auto border p-2 rounded">
                {members.length === 0 && (
                  <div className="text-sm italic text-gray-400">No users to invite</div>
                )}
                {members.map((user) => (
                  <label key={user.email} className="flex items-center gap-2 mb-1 text-sm">
                    <input
                      type="checkbox"
                      value={user.email}
                      onChange={(e) => {
                        const email = e.target.value;
                        setSelectedMembers((prev) =>
                          e.target.checked
                            ? [...prev, email]
                            : prev.filter((m) => m !== email)
                        );
                      }}
                    />
                    {user.name || user.email}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
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
