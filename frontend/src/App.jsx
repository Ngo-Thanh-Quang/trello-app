import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Card from "./pages/Card";
import Login from "./pages/Login";
import Dashboard from "./components/Dashboard";
import Notifications from "./pages/Notifications";



const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer autoClose={1000} pauseOnHover={false} />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Dashboard />} />
          <Route path="profile/:email" element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="board/:boardId" element={<Card />} />
          <Route path="login" element={<Login />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
