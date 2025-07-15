const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");
const { authToken } = require("../middlewares/auth");

router.post("/", authToken , boardController.createBoard);
router.get("/", authToken , boardController.getBoards);
router.get("/:id", authToken , boardController.getBoardById);
// updateBoard, 
// deleteBoard, 


module.exports = router;
