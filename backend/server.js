const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoute");
const boardRoute = require("./routes/boardRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/boards", boardRoute);

app.get("/", (req, res) => {
  res.send("Welcome to backend server!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
