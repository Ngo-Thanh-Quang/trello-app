import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Login from "./Login";

const Home = () => {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const tokenLogin = localStorage.getItem("tokenLogin");
    if (tokenLogin) {
      setIsLogged(true);
    }
  }, []);

  return isLogged ? (
    <div>
      <Navbar />
    </div>
  ) : (
    <Login />
  );
};

export default Home;
