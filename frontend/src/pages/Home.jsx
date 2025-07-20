import React, { useEffect, useState } from "react";
import Navbar from "../components/bar/Navbar";
import Login from "./Login";
import BoardPage from "./Board";

const Home = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const tokenLogin = localStorage.getItem("tokenLogin");
    if (tokenLogin) {
      setToken(tokenLogin);
      setIsLogged(true);
    }
  }, []);

  return isLogged ? (
    <div>
      <Navbar />
      <BoardPage token={token} />
    </div>
  ) : (
    <Login setIsLogged={setIsLogged} />
  );
};

export default Home;
