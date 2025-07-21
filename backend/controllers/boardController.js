const inviteModel = require("../models/inviteModel");
const db = require("../firebase");
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
    await inviteModel.createInvitation({
      invite_id: `owner_${Date.now()}`,
      board_owner_id: req.userEmail,
      board_id: newBoard.id || newBoard.board_id || newBoard._id,
      member_id: req.userEmail,
      email_member: req.userEmail,
      status: "accepted",
    });
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
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    // Cho phép owner hoặc member có status accepted truy cập
    if (board.userEmail === req.userEmail) {
      return res.status(200).json(board);
    }
    // Kiểm tra nếu user là member với status accepted
    const inviteSnapshot = await db.collection('invitations')
      .where('board_id', '==', board.id)
      .where('email_member', '==', req.userEmail)
      .where('status', '==', 'accepted')
      .limit(1)
      .get();
    if (!inviteSnapshot.empty) {
      return res.status(200).json(board);
    }
    return res.status(404).json({ message: "Board not found or unauthorized" });
  } catch (error) {
    console.error("Error getting board by id:", error);
    return res.status(500).json({ message: "Failed to get board" });
  }
};

// chinh sua bang
exports.updateBoard = async (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;
  if (!name) {
    return res.status(400).json({ message: "Board name is required" });
  }
  try {
    const board = await boardsModel.getBoardById(id);
    if (!board || board.userEmail !== req.userEmail) {
      return res
        .status(404)
        .json({ message: "Board not found or unauthorized" });
    }
    const updatedBoard = await boardsModel.updateBoard(id, {
      name,
      description,
    });

    return res.status(200).json(updatedBoard);
  } catch (error) {
    console.error("Error updating board:", error);
    return res.status(500).json({ message: "Failed to update board" });
  }
};

// xoa bang
exports.deleteBoard = async (req, res) => {
  const { id } = req.params;
  try {
    const board = await boardsModel.getBoardById(id);
    if (!board || board.userEmail !== req.userEmail) {
      return res
        .status(404)
        .json({ message: "Board not found or unauthorized" });
    }

    const cardsSnapshot = await db
      .collection("cards")
      .where("boardId", "==", id)
      .get();
    const cardIds = cardsSnapshot.docs.map((doc) => doc.id);

    if (cardIds.length > 0) {
      const BATCH_SIZE = 10;
      for (let i = 0; i < cardIds.length; i += BATCH_SIZE) {
        const batch = cardIds.slice(i, i + BATCH_SIZE);
        const taskSnapshot = await db
          .collection("tasks")
          .where("cardId", "in", batch)
          .get();

        const deleteTaskPromises = taskSnapshot.docs.map((doc) =>
          doc.ref.delete()
        );
        await Promise.all(deleteTaskPromises);
      }
    }
    // xoa card lien quan den board
    const deleteCardPromises = cardsSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deleteCardPromises);

    // xoa invites lien quan den board
    const invitesSnapshot = await db.collection('invitations').where('board_id', '==', id).get();
    const deleteInvitePromises = invitesSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deleteInvitePromises);

    // Xóa board
    await boardsModel.deleteBoard(id);

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting board:", error);
    return res.status(500).json({ message: "Failed to delete board" });
  }
};

// Hien thi phan board da duoc moi va da chap nhan
exports.getBoardsInvitedAccepted = async (req, res) => {
  try {
    // Lay trong db invitations co emailmember la user hien tai voi stauts accepted
    const email = req.userEmail;
    const inviteSnapshot = await db
      .collection("invitations")
      .where("email_member", "==", email)
      .where("status", "==", "accepted")
      .limit(50)
      .get();
    const boardIds = inviteSnapshot.docs.map((doc) => doc.data().board_id);
    if (boardIds.length === 0) return res.status(200).json([]);
    // Lấy thông tin các board theo id
    const boardsCollection = db.collection("boards");
    const boardPromises = boardIds.map((id) => boardsCollection.doc(id).get());
    const boardDocs = await Promise.all(boardPromises);
    const boards = boardDocs
      .filter((doc) => doc.exists)
      .map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json(boards);
  } catch (error) {
    console.error("Error getting invited boards:", error);
    return res.status(500).json({ message: "Failed to get invited boards" });
  }
};
