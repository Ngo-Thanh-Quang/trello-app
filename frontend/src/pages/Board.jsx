import React, { useRef, useEffect, useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import useBoards from "../hooks/useBoard";
import { FaBars, FaTimes } from "react-icons/fa";

const BoardPage = () => {
  const {
    boards,
    invitedBoards,
    selectedBoardId,
    setSelectedBoardId,
    handleCreateBoard,
    handleEditBoard,
    handleDeleteBoard,
  } = useBoards();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newBoard, setNewBoard] = useState({ name: "", description: "" });
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <>
      {/* Toggle Sidebar */}
      <div className="md:hidden fixed top-5 right-4 z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white p-2 text-2xl">
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <Sidebar
        ref={sidebarRef}
        boards={boards}
        invitedBoards={invitedBoards}
        fetchBoards={() => { }}
        onSelectBoard={setSelectedBoardId}
        selectedBoardId={selectedBoardId}
        handleEditBoard={handleEditBoard}
        handleDeleteBoard={handleDeleteBoard}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setShowCreate={setShowCreate}
      />

      <div className="md:ml-64 pt-20 transition-all duration-300">
        <Outlet context={{
          boards,
          invitedBoards,
          selectedBoardId, onSelectBoard: setSelectedBoardId,
          handleEditBoard,
          handleDeleteBoard,
        }} />
      </div>

      {/* Modal Create Board */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <form
            className="bg-white p-6 rounded shadow-md w-72 sm:w-96 text-gray-800"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateBoard(newBoard);
              setShowCreate(false);
              setNewBoard({ name: "", description: "" });
            }}
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
              <button type="button" className="px-4 py-2 bg-gray-300" onClick={() => setShowCreate(false)}>
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white">Create</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default BoardPage;
