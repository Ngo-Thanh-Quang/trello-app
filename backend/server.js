const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./firebase");
const bcrypt = require("bcrypt");
const app = express();
const jwt = require("jsonwebtoken");
const verificationCodes = new Map();

app.use(cors());
app.use(express.json());

const nodemailer = require("nodemailer");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "7d"});
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

app.post("/auth/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRef = db.collection("user");
    const snapshot = await userRef.where("email", "==", email).get();
    if (snapshot.empty) {
      return res.status(401).json({ message: "User not found" });
    }
    let userData;
    snapshot.forEach((doc) => {
      userData = doc.data();
    });
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken({ email: userData.email, name: userData.name });
    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/auth/request-verification", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes.set(email, otp);

  try {
    await transporter.sendMail({
      from: "ngothanhquang.dev@gmail.com",
      to: email,
      subject: "Account registration verification code",
      text: `Your verification code is: ${otp}`,
    });
    res
      .status(200)
      .json({ message: "Verification code has been sent to email" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Unable to send verification email" });
  }
});

app.post("/auth/signup", async (req, res) => {
  const { email, password, name, otp } = req.body;

  try {
    const savedCode = verificationCodes.get(email);
    if (!savedCode || savedCode !== otp) {
      return res
        .status(401)
        .json({
          message: "The verification code is incorrect or has expired.",
        });
    }

    const userRef = db.collection("user");
    const snapshot = await userRef.where("email", "==", email).get();

    if (!snapshot.empty) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userRef.add({
      name,
      email,
      password: hashedPassword,
    });

    verificationCodes.delete(email);
    const token = generateToken({ email, name });
    res
      .status(201)
      .json({ message: "Account created successfully", token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/auth/google-signin", async (req, res) => {
  const { email, name, picture } = req.body;

  try {
    const userRef = db.collection("user");
    const snapshot = await userRef.where("email", "==", email).get();

    if (snapshot.empty) {
      await userRef.add({ email, name, picture, google: true });
    }
    const token = generateToken({ email, name, picture });
    res.status(200).json({ message: "Google login successful!", token });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
