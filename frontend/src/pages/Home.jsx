import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Login from "./Login";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";


import axios from "axios";


const Home = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [boards, setBoards] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  

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

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  useEffect(() => {
    const tokenLogin = localStorage.getItem("tokenLogin");
    if (tokenLogin) {
      setIsLogged(true);
      fetchBoards();
    }
  }, []);

  return isLogged ? (
    <div>
      <Navbar />
      {successMsg && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in">
          {successMsg}
        </div>
      )}
      <Sidebar boards={boards} fetchBoards={fetchBoards} showSuccess={showSuccess} onSelectBoard={setSelectedBoardId} selectedBoardId={selectedBoardId} />
      <div className="ml-64 pt-20">
        <Dashboard boards={boards} fetchBoards={fetchBoards} selectedBoardId={selectedBoardId} onSelectBoard={setSelectedBoardId} />
      </div>
    </div>
  ) : (
    <Login />
  );
};

export default Home;
