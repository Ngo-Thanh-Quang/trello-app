const bcrypt = require("bcrypt");
const { emailVerification } = require("../utils/email");
const { getUser, createUser } = require("../models/userModel");
const { generateToken } = require("../utils/token");
const db = require("../firebase");



const verificationCodes = new Map();

//Hàm gửi mã xác thực email
exports.verifyEmail = async (req, res) => {
  const { email } = req.body;

  //Tạo mã OTP 6 số ngẫu nhiên
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes.set(email, otp);

  try {
    await emailVerification(email, otp);
    res
      .status(200)
      .json({ message: "Verification code has been sent to email" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Unable to send verification email" });
  }
};

//Hàm đăng ký tài khoản
exports.signUp = async (req, res) => {
  const { email, password, name, otp } = req.body;
  try {
    const savedCode = verificationCodes.get(email);
    if (!savedCode || savedCode !== otp) {
      return res.status(401).json({
        message: "The verification code is incorrect or has expired.",
      });
    }

    const checkExist = await getUser(email);
    if (checkExist) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser({
      name,
      email,
      password: hashedPassword,
      picture: "https://res.cloudinary.com/dwalye3nj/image/upload/v1752460385/user_doe5i4.jpg",
      google: false,
    });

    verificationCodes.delete(email);
    const token = generateToken({ email, name });
    res.status(201).json({ message: "Account created successfully", token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Hàm đăng nhập
exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUser(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ email: user.email, name: user.name });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Hàm đăng nhập bằng Google
exports.googleSignIn = async (req, res) => {
  const { email, name, picture } = req.body;

  try {
    const user = await getUser(email);
    if (!user) {
      await createUser({
        email,
        name,
        picture,
        google: true,
      });
    }
    const token = generateToken({ email, name, picture });
    res.status(200).json({ message: "Google login successful!", token });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getUsersToInvite = async (req, res) => {
  try {
    const snapshot = await db.collection("user").get();
    if (snapshot.empty) return res.status(200).json([]);

    const users = snapshot.docs
      .map((doc) => doc.data())
      .filter(
        (u) => u.email && u.email.trim() && u.email.trim() !== req.userEmail?.trim()
      );

    return res.status(200).json(users);
  } catch (error) {
    console.error("Loi khi lay danh sach member:", error);
    return res.status(500).json({ message: "loi 500 fetch member" });
  }
};
