const express = require("express");
const router = express.Router();
const { authToken } = require("../middlewares/auth");
const taskController = require("../controllers/taskController");

router.post("/:cardId", authToken, taskController.createTask);
router.get("/:cardId", authToken, taskController.getTasksByCardId);
router.delete("/delete/:taskId", authToken, taskController.deleteTask);
router.put("/update/:taskId", authToken, taskController.updateTask);

module.exports = router;
