import React, { useState } from "react";
import axios from "axios";
import gg_img from "../assets/gg_img.webp";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (state === "Login") {
      try {
        const res = await axios.post(`${backendUrl}/auth/signin`, {
          email,
          password,
        });
        if (res.status === 200) {
          toast.success(res.data.message || "Login successful!");
          localStorage.setItem("tokenLogin", res.data.token);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message || "Invalid credentials");
        } else {
          toast.error("Server error!");
        }
        console.error("Login failed:", error);
      }
    } else if (state === "Register") {
      try {
        const res = await axios.post(
          `${backendUrl}/auth/request-verification`,
          { email }
        );

        if (res.status === 200) {
          setShowOtp(true);
        }
      } catch (error) {
        console.error("OTP error:", error);
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/auth/signup`, {
        email,
        password,
        name,
        otp,
      });
      if (res.status === 201) {
        toast.success("Account created successfully!");
        localStorage.setItem("tokenLogin", res.data.token);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Invalid OTP");
      } else {
        toast.error("Server error!");
      }
      console.error("Signup error:", error);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;
      try {
        const profileRes = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        const { email, name, picture } = profileRes.data;
        const res = await axios.post(`${backendUrl}/auth/google-signin`, {
          email,
          name,
          picture,
        });
        localStorage.setItem("tokenLogin", res.data.token);
        toast.success("Login with Google successful!");
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        toast.error("Google login failed!");
        console.error(error);
      }
    },
    onError: () => toast.error("Google login error"),
    flow: "implicit",
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-center sm:mt-10 mt-20">{state}</h1>
      <form onSubmit={handleSubmit} className="max-w-md sm:mx-auto mx-5 mt-10">
        {state === "Register" && (
          <div className="mb-3">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Your name"
              required
            />
          </div>
        )}
        <div className="mb-3">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div className="mb-3">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <div className="mb-6">
          {state === "Login" ? (
            <p
              onClick={() => setState("Register")}
              className="text-gray-500 text-right italic text-sm font-semibold cursor-pointer"
            >
              Don't have an account?
            </p>
          ) : (
            <p
              onClick={() => setState("Login")}
              className="text-gray-500 text-right italic text-sm font-semibold cursor-pointer"
            >
              Already have an account?
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            className="bg-blue-500 hover:bg-blue-700 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
            type="submit"
          >
            {state === "Login" ? "Sign In" : "Sign Up"}
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-500 text-center italic text-sm font-semibold">
            Or continue with:
          </p>
        </div>
        <div className="flex items-center justify-between mb-6">
          <button
            className="bg-white hover:bg-gray-200 w-full border border-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
            type="button"
            onClick={() => handleGoogleLogin()}
          >
            <img src={gg_img} alt="Google" className="h-6 inline-block mr-1" />{" "}
            Google
          </button>
        </div>
      </form>

      {showOtp && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <div
              className="absolute flex right-3 top-2 cursor-pointer"
              onClick={() => setShowOtp(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </div>
            <h2 className="text-xl font-bold mb-4 text-center">
              Email Authentication
            </h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              placeholder="Enter OTP code"
              className="input mb-4 w-full focus:outline-none"
            />
            <button
              onClick={handleOtpSubmit}
              className="bg-blue-500 text-white cursor-pointer w-full py-2 rounded hover:bg-blue-600"
            >
              Verify
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;