const cardsModel = require("../models/cardModel");
const db = require('../firebase');

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
    const createdAt = new Date().toISOString().split("T")[0];
    const newCard = await cardsModel.createCard({ boardId, title, createdAt });
    return res.status(201).json(newCard);
  } catch (error) {
    console.error("Error creating card:", error);
    return res.status(500).json({ message: "Failed to create card" });
  }
};

exports.updateCard = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    await cardsModel.updateCard(id, { title });
    return res.status(200).json({ message: "Card updated successfully" });
  } catch (error) {
    console.error("Error updating card:", error);
    return res.status(500).json({ message: "Failed to update card" });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const tasksSnapshot = await db.collection('tasks').where('cardId', '==', req.params.id).get();
    const deleteTaskPromises = tasksSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deleteTaskPromises);

    await cardsModel.deleteCard(req.params.id);
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting card:", error);
    return res.status(500).json({ message: "Failed to delete card" });
  }
};
