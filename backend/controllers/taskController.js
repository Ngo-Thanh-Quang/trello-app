const taskModel = require("../models/taskModel");

exports.getTasksByCardId = async (req, res) => {
  const { cardId } = req.params;

  try {
    const tasks = await taskModel.getTasksByCardId(cardId);
    return res.status(200).json(tasks);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

exports.createTask = async (req, res) => {
  const { cardId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Task content is required" });
  }

  try {
    const task = await taskModel.createTask(cardId, content);
    return res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create task" });
  }
};

exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    await taskModel.deleteTask(taskId);
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete task" });
  }
};

exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status, assignee, order } = req.body;

  try {
    await taskModel.updateTask(taskId, title, description, status, assignee, order);
    return res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update task" });
  }
};

exports.updateTaskMove = async (req, res) => {
  const { taskId } = req.params;
  const { cardId, order } = req.body;

  if (!cardId || order === undefined) return res.status(400).json({ message: "cardId and order are required" });

  try {
    await taskModel.updateTaskMove(taskId, cardId, order);
    return res.status(200).json({ message: "Card ID updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update card ID" });
  }
};


