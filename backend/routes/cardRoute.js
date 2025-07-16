const express = require("express");
const router = express.Router();
const cardController = require("../controllers/cardController");
const { authToken } = require("../middlewares/auth");

router.get("/:boardId", authToken, cardController.getCardsByBoardId);
router.post("/", authToken, cardController.createCard);
router.delete("/:id", authToken, cardController.deleteCard);
router.put("/:id", authToken, cardController.updateCard);

module.exports = router;
