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
    assignee: [], 
    description: "",
    status: "To do",
    createdAt: new Date().toISOString(),
    order: Date.now(),
  };
  const taskRef = await tasksCollection.add(newTask);
  return { id: taskRef.id, ...newTask };
};

exports.deleteTask = async (taskId) => {
  await tasksCollection.doc(taskId).delete();
};

exports.updateTask = async (taskId, title, description, status, assignee, order) => {
  const taskRef = tasksCollection.doc(taskId);

  const updateData = {
    title,
    description,
    status,
    assignee
  };

  if (order !== undefined) {
    updateData.order = order;
  }

  await taskRef.update(updateData);
};

exports.updateTaskMove = async (taskId, cardId, order) => {
  const taskRef = tasksCollection.doc(taskId);
  await taskRef.update({ cardId, order });
};


