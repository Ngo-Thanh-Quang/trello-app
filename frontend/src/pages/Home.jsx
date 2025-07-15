import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Login from "./Login";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { Outlet } from "react-router";

const Home = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  // show bang
  const fetchBoards = async () => {
    const token = localStorage.getItem("tokenLogin");
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:4000/boards", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoards(res.data);
    } catch {
      setBoards([]);
    }
  };

  useEffect(() => {
    const tokenLogin = localStorage.getItem("tokenLogin");
    if (tokenLogin) {
      setIsLogged(true);
      fetchBoards();
    }
  }, []);

  // edit bang
  const handleEditBoard = async (boardId, updatedData) => {
    const token = localStorage.getItem("tokenLogin");
    if (!token) return;
    try {
      const res = await axios.put(`http://localhost:4000/boards/${boardId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        await fetchBoards();
      } else {
        console.error("Edit board failed: ", res.data);
      }
    } catch (err) {
      console.error("Failed to edit board", err);
    }
  };

  // xoa bang
  const handleDeleteBoard = async (boardId) => {
    const token = localStorage.getItem("tokenLogin");
    if (!token) return;
    try {
      const res = await axios.delete(`http://localhost:4000/boards/${boardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 204) {
        await fetchBoards();
      } else {
        console.error("Delete board failed: ", res.data);
      }
    } catch (err) {
      console.error("Failed to delete board", err);
    }
  };

  return isLogged ? (
    <div>
      <Navbar />
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
    </div>
  ) : (
    <Login setIsLogged={setIsLogged} />
  );
};

export default Home;
