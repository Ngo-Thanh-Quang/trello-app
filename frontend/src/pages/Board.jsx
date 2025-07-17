// src/pages/Board.jsx
import React, { useEffect, useState, useRef } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { FaBars, FaTimes } from "react-icons/fa";

const BoardPage = ({ token }) => {
  const [boards, setBoards] = useState([]);
  const [invitedBoards, setInvitedBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newBoard, setNewBoard] = useState({ name: "", description: "" });
  const sidebarRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // danh sach bang
  const fetchBoards = async () => {
    const token = localStorage.getItem("tokenLogin");
    if (!token) return;
    try {
      const res = await axios.get(`${backendUrl}/boards`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoards(res.data);
    } catch {
      setBoards([]);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("tokenLogin");

    try {
      const res = await axios.post(`${backendUrl}/boards`, newBoard, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Create new board successfully!");
      setShowCreate(false);
      setNewBoard({ name: "", description: "" });
      fetchBoards();
    } catch (err) {
      console.error("Error creating board:", err);
      toast.error("Failed to create board. Please try again.");
    }
  };

  // chinh sua bang
  const handleEditBoard = async (boardId, updatedData) => {
    const token = localStorage.getItem("tokenLogin");
    if (!token) return;
    try {
      const res = await axios.put(
        `${backendUrl}/boards/${boardId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        toast.success("Board updated successfully!");
        await fetchBoards();
      } else {
        console.error("Edit board failed: ", res.data);
      }
    } catch (err) {
      console.error("Failed to edit board", err);
      toast.error("Failed to update board");
    }
  };

  // xoa bangr
  const handleDeleteBoard = async (boardId) => {
    const token = localStorage.getItem("tokenLogin");
    if (!token) return;
    try {
      const res = await axios.delete(`${backendUrl}/boards/${boardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 204) {
        toast.success("Board deleted successfully!");
        await fetchBoards();
      } else {
        console.error("Delete board failed: ", res.data);
      }
    } catch (err) {
      console.error("Failed to delete board", err);
      toast.error("Failed to delete board");
    }
  };

  useEffect(() => {
    fetchBoards();

    const fetchInvitedBoards = async () => {
      const token = localStorage.getItem("tokenLogin");
      if (!token) return;
      try {
        const res = await axios.get(`${backendUrl}/boards/invited-accepted`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvitedBoards(res.data);
      } catch {
        setInvitedBoards([]);
      }
    };

    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    fetchInvitedBoards();
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [token, sidebarOpen]);

  return (
    <>
      <div className="md:hidden fixed top-5 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white p-2 text-2xl"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <Sidebar
        ref={sidebarRef}
        boards={boards}
        invitedBoards={invitedBoards}
        fetchBoards={fetchBoards}
        onSelectBoard={setSelectedBoardId}
        selectedBoardId={selectedBoardId}
        handleEditBoard={handleEditBoard}
        handleDeleteBoard={handleDeleteBoard}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setShowCreate={setShowCreate}
      />
      <div className="md:ml-64 pt-20 transition-all duration-300">
        <Outlet
          context={{
            boards,
            invitedBoards,
            selectedBoardId,
            onSelectBoard: setSelectedBoardId,
            handleEditBoard,
            handleDeleteBoard,
          }}
        />
      </div>
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <form
            className="bg-white p-6 rounded shadow-md w-72 sm:w-96 text-gray-800"
            onSubmit={handleCreateBoard}
          >
            <h2 className="text-xl font-bold mb-4">Create Board</h2>
            <input
              className="w-full mb-3 p-2 border rounded"
              placeholder="Board Name"
              value={newBoard.name}
              onChange={(e) =>
                setNewBoard({ ...newBoard, name: e.target.value })
              }
              required
            />
            <textarea
              className="w-full mb-3 p-2 border rounded"
              placeholder="Board Description"
              value={newBoard.description}
              onChange={(e) =>
                setNewBoard({ ...newBoard, description: e.target.value })
              }
            />
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
    </>
  );
};

export default BoardPage;
