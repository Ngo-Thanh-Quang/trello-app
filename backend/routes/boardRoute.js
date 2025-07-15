const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");
const { authToken } = require("../middlewares/auth");

router.post("/", authToken , boardController.createBoard);
router.get("/", authToken , boardController.getBoards);
router.get("/:id", authToken , boardController.getBoardById);
router.put("/:id", authToken , boardController.updateBoard);
router.delete("/:id", authToken , boardController.deleteBoard);


module.exports = router;
