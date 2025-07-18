const db = require("../firebase");

const boardsCollection = db.collection("boards");

const createBoard = async (data) => {
  const docRef = await boardsCollection.add(data);
  return { id: docRef.id, ...data };
};

const getBoardsByUser = async (userEmail) => {
  let snapshot;
  if (userEmail) {
    snapshot = await boardsCollection.where("userEmail", "==", userEmail).limit(100).get(); 
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



const updateBoard = async (id, data) => {
  const docRef = boardsCollection.doc(id);
  await docRef.update(data);
  const updatedDoc = await docRef.get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

const deleteBoard = async (id) => {
  await boardsCollection.doc(id).delete();
};

module.exports = {
  createBoard,
  getBoardsByUser,
  getBoardById,
  updateBoard,
  deleteBoard,
};
