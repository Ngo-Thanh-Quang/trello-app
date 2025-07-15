const db = require("../firebase");
const cardsCollection = db.collection("cards");

const getCardsByBoardId = async (boardId) => {
  const snapshot = await cardsCollection.where("boardId", "==", boardId).get();
  const cards = [];
  snapshot.forEach(doc => {
    cards.push({ id: doc.id, ...doc.data() });
  });
  return cards;
};

const createCard = async (data) => {
  const docRef = await cardsCollection.add(data);
  return { id: docRef.id, ...data };
};

const deleteCard = async (id) => {
  await cardsCollection.doc(id).delete();
};

module.exports = {
  getCardsByBoardId,
  createCard,
  deleteCard,
};
