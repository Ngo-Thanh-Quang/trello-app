// 📁 api/authApi.js
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const apiLogin = async (email, password) => {
  const res = await axios.post(`${backendUrl}/auth/signin`, { email, password });
  return res.data;
};

export const apiVerifyOtp = async (email) => {
  const res = await axios.post(`${backendUrl}/auth/request-verification`, { email });
  return res.data;
};

export const apiRegister = async (name, email, password, otp) => {
  const res = await axios.post(`${backendUrl}/auth/signup`, {
    name,
    email,
    password,
    otp,
  });
  return res.data;
};

export const apiGoogleLogin = async ({ email, name, picture }) => {
  const res = await axios.post(`${backendUrl}/auth/google-signin`, {
    email,
    name,
    picture,
  });
  return res.data;
};

export const apiFetchGoogleProfile = async (accessToken) => {
  const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};
