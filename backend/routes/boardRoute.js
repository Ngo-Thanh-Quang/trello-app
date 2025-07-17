const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");
const { authToken } = require("../middlewares/auth");
const inviteController = require("../controllers/inviteController");



router.post("/", authToken , boardController.createBoard);
router.get("/", authToken , boardController.getBoards);
router.get("/invited-accepted", authToken, boardController.getBoardsInvitedAccepted);
router.get("/:id", authToken , boardController.getBoardById);
router.put("/:id", authToken , boardController.updateBoard);
router.delete("/:id", authToken , boardController.deleteBoard);
// Phan xu ly moi vao bang
router.post('/:boardId/invite', authToken, inviteController.inviteToBoard);
// router.post('/:boardId/cards/:id/invite/accept', authToken, inviteController.acceptInvite);
router.post('/:boardId/invite/accept', authToken, inviteController.acceptInvite);
router.get('/:boardId/invited-emails', inviteController.getInvitedEmails);

module.exports = router;
