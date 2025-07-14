const db = require("../firebase");

const boardsCollection = db.collection("boards");

const createBoard = async (data) => {
  const docRef = await boardsCollection.add(data);
  return { id: docRef.id, ...data };
};

const getBoardsByUser = async (userEmail) => {
  let snapshot;
  if (userEmail) {
    snapshot = await boardsCollection.where("userEmail", "==", userEmail).get();
  } else {
    snapshot = await boardsCollection.get();
  }
  const boards = [];
  snapshot.forEach((doc) => {
    boards.push({ id: doc.id, ...doc.data() });
  });
  return boards;
};

const getBoardById = async (id) => {
  const doc = await boardsCollection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};


module.exports = {
  createBoard,
  getBoardsByUser,
  getBoardById,
  // updateBoard, 
  // deleteBoard, 
};
