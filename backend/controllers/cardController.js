const cardsModel = require("../models/cardModel");

exports.getCardsByBoardId = async (req, res) => {
  const { boardId } = req.params;
  try {
    const cards = await cardsModel.getCardsByBoardId(boardId);
    return res.status(200).json(cards);
  } catch (error) {
    console.error("Error getting cards:", error);
    return res.status(500).json({ message: "Failed to get cards" });
  }
};

exports.createCard = async (req, res) => {
  const { boardId, title } = req.body;
  if (!boardId || !title) {
    return res.status(400).json({ message: "boardId and title are required" });
  }

  try {
    const newCard = await cardsModel.createCard({ boardId, title });
    return res.status(201).json(newCard);
  } catch (error) {
    console.error("Error creating card:", error);
    return res.status(500).json({ message: "Failed to create card" });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    await cardsModel.deleteCard(req.params.id);
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting card:", error);
    return res.status(500).json({ message: "Failed to delete card" });
  }
};
