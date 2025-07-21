const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoute");
const profileRoute = require("./routes/profileRoute");
const boardRoute = require("./routes/boardRoute");
const cardRoute = require("./routes/cardRoute");
const taskRoute = require("./routes/taskRoute");
const notificationRoute = require("./routes/notificationRoute");
const userRoute = require("./routes/userRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/profile", profileRoute);
app.use("/boards", boardRoute);
app.use("/cards", cardRoute);
app.use("/tasks", taskRoute);
app.use("/notifications", notificationRoute);
app.use("/authuser", userRoute);

app.get("/", (req, res) => {
  res.send("Welcome to backend server!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});