const db = require("../firebase");
const tasksCollection = db.collection("tasks");

exports.getTasksByCardId = async (cardId) => {
  const snapshot = await tasksCollection.where("cardId", "==", cardId).get();
  const tasks = [];
  snapshot.forEach(doc => tasks.push({ id: doc.id, ...doc.data() }));
  return tasks;
};

exports.createTask = async (cardId, content) => {
  const newTask = {
    cardId,
    title: content, 
    description: "",
    status: "To do",
    createdAt: new Date().toISOString(),
  };
  const taskRef = await tasksCollection.add(newTask);
  return { id: taskRef.id, ...newTask };
};

exports.deleteTask = async (taskId) => {
  await tasksCollection.doc(taskId).delete();
};

exports.updateTask = async (taskId, title, description, status, assignee) => {
  const taskRef = tasksCollection.doc(taskId);
  await taskRef.update({
    title,
    description,
    status,
    assignee
  });
};

exports.updateTaskMove = async (taskId, cardId) => {
  const taskRef = tasksCollection.doc(taskId);
  await taskRef.update({ cardId });
};


