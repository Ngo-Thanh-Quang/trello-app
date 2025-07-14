const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/", authenticateToken, boardController.createBoard);
router.get("/", authenticateToken, boardController.getBoards);
router.get("/:id", authenticateToken, boardController.getBoardById);
// updateBoard, 
// deleteBoard, 


module.exports = router;
