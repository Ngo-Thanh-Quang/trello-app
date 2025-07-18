// 📁 hooks/useLogin.js
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import {
  apiLogin,
  apiRegister,
  apiVerifyOtp,
  apiGoogleLogin,
  apiFetchGoogleProfile,
} from "../api/loginApi";

const useLogin = (setIsLogged) => {
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (state === "Login") {
        const res = await apiLogin(email, password);
        localStorage.setItem("tokenLogin", res.token);
        setIsLogged(true);
        navigate("/");
      } else {
        await apiVerifyOtp(email);
        setShowOtp(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const changeMode = () => {
    setState((prev) => (prev === "Login" ? "Register" : "Login"));
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiRegister(name, email, password, otp);
      localStorage.setItem("tokenLogin", res.token);
      setIsLogged(true);
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      setLoading(true);
      try {
        const profile = await apiFetchGoogleProfile(access_token);
        const res = await apiGoogleLogin(profile);
        localStorage.setItem("tokenLogin", res.token);
        toast.success("Login with Google successful!");
        setIsLogged(true);
        navigate("/");
      } catch (error) {
        toast.error("Google login failed!");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    onError: () => toast.error("Google login error"),
    flow: "implicit",
  });

  return {
    state,
    setState,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    otp,
    setOtp,
    loading,
    showOtp,
    setShowOtp,
    handleSubmit,
    handleOtpSubmit,
    handleGoogleLogin,
    changeMode,
  };
};

export default useLogin;
