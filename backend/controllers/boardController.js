const boardsModel = require("../models/boardModel");

// Tao bang moi
exports.createBoard = async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Board name is required" });
  }
  const board = {
    name,
    description: description || "",
    userEmail: req.userEmail,
  };
  try {
    const newBoard = await boardsModel.createBoard(board);
    return res.status(201).json(newBoard);
  } catch (error) {
    console.error("Loi:", error);
    return res.status(500).json({ message: "Check Email Of Users" });
  }
};

// Lay tat ca board cua user
exports.getBoards = async (req, res) => {
  try {
    const boards = await boardsModel.getBoardsByUser(req.userEmail);
    return res.status(200).json(boards);
  } catch (error) {
    console.error("Error getting boards:", error);
    return res.status(500).json({ message: "Failed to get boards" });
  }
};

// Lay thong tin board theo ID cua board
exports.getBoardById = async (req, res) => {
  try {
    const board = await boardsModel.getBoardById(req.params.id);
    if (!board || board.userEmail !== req.userEmail) {
      return res.status(404).json({ message: "Board not found or unauthorized" });
    }
    return res.status(200).json(board);
  } catch (error) {
    console.error("Error getting board by id:", error);
    return res.status(500).json({ message: "Failed to get board" });
  }
};


