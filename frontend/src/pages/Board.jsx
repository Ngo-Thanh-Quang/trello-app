// src/pages/Board.jsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const BoardPage = ({ token }) => {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // danh sach bang
  const fetchBoards = async () => {
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
      const res = await axios.delete(
        `${backendUrl}/boards/${boardId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
  }, [token]);

  return (
    <>
      <Sidebar
        boards={boards}
        fetchBoards={fetchBoards}
        onSelectBoard={setSelectedBoardId}
        selectedBoardId={selectedBoardId}
        handleEditBoard={handleEditBoard}
        handleDeleteBoard={handleDeleteBoard}
      />
      <div className="ml-64 pt-20">
        <Outlet
          context={{
            boards,
            selectedBoardId,
            onSelectBoard: setSelectedBoardId,
            handleEditBoard,
            handleDeleteBoard,
          }}
        />
      </div>
    </>
  );
};

export default BoardPage;
