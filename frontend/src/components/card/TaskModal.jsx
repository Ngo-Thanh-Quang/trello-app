import React from "react";
import { useParams } from "react-router";
import { useCard } from "../../hooks/useCard";

const TaskModal = ({
  mode,
  taskTitle,
  taskDescription,
  taskStatus,
  taskAssignee,
  setShowDetailTask,
  setTaskId,
  setEditTask,
  boardId,
  boardMembers,
  setTaskTitle,
  setTaskDescription,
  setTaskAssignee,
  setTaskStatus,
  cards,
  updateTask,
  taskId,
  addTask,
  createTask,
  openCreateTask,
}) => {

  const handleAddTask = async () => {
    if (!taskTitle.trim()) return;
    await addTask(createTask, taskTitle);
    setTaskTitle("");
    openCreateTask(null);
  };

  return mode === "create" ? (
    <div className="mt-2 close">
      <input
        className="input p-2 mb-2 bg-white w-full"
        placeholder="Task title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />
      <button
        className="w-[40%] cursor-pointer font-medium rounded-lg p-2 text-center flex items-center gap-2 text-white bg-blue-600 transition hover:bg-blue-500"
        onClick={() => handleAddTask(createTask, taskTitle)}
      >
        Add Task
      </button>
    </div>
  ) : (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-10">
      {mode === "detail" ? (
        <div className="bg-white p-6 rounded-lg shadow-lg w-75 sm:w-96 relative close">
          <div
            className="absolute flex right-3 top-2 cursor-pointer"
            onClick={() => {
              setShowDetailTask(false);
              setTaskId(null);
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </div>
          <h2 className="text-xl font-bold mb-4 text-center">
            Task Information
          </h2>
          <div className="flex gap-2">
            <div>
              <p className="p-2 font-semibold">Assignee:</p>
              <p className="p-2 font-semibold">Title:</p>
              <p className="p-2 font-semibold">Description:</p>
              <p className="p-2 font-semibold">Status:</p>
            </div>
            <div>
              <p className="p-2 text-gray-600 font-semibold italic capitalize">
                {taskAssignee.join(", ") || "Unassigned"}
              </p>
              <p className="p-2 text-gray-600 font-semibold italic capitalize">
                {taskTitle}
              </p>
              <p className="p-2 text-gray-600 font-semibold italic">
                {taskDescription || "No description"}
              </p>
              <p className="p-2 text-gray-600 font-semibold italic">
                {taskStatus}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg w-75 sm:w-96 relative close">
          <div
            className="absolute flex right-3 top-2 cursor-pointer"
            onClick={() => {
              setEditTask(false);
              setTaskId(null);
              setTaskTitle("");
              setTaskDescription("");
              setTaskAssignee("");
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </div>
          <h2 className="text-xl font-bold mb-4 text-center">Edit Task</h2>
          <label for="members" className="p-2 pr-5 font-semibold">
            Assignee:
          </label>
          <select
            multiple
            value={taskAssignee}
            onChange={(e) => {
              const selected = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              setTaskAssignee(selected);
            }}
            className="w-full p-2 border rounded"
          >
            {boardMembers[boardId]?.map((member) => (
              <option key={member.name} value={member.name}>
                {member.name}
              </option>
            ))}
          </select>

          <br />
          <label className="p-2 pr-5 font-semibold block">Status:</label>
          <div className="flex gap-4 mb-4 px-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="To do"
                checked={taskStatus === "To do"}
                onChange={(e) => setTaskStatus(e.target.value)}
              />
              To do
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="In progress"
                checked={taskStatus === "In progress"}
                onChange={(e) => setTaskStatus(e.target.value)}
              />
              In progress
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="Done"
                checked={taskStatus === "Done"}
                onChange={(e) => setTaskStatus(e.target.value)}
              />
              Done
            </label>
          </div>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Enter title"
            className="input p-2 w-full border-b border-gray-300 focus:outline-none"
          />
          <input
            type="text"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Enter description"
            className="input p-2 mb-4 w-full border-b border-gray-300 focus:outline-none"
          />
          <button
            onClick={() => {
              const taskData = {
                title: taskTitle,
                description: taskDescription,
                status: taskStatus,
                assignee: taskAssignee,
              };
              const card = cards.find((c) =>
                c.tasks.some((t) => t.id === taskId)
              );
              if (card) {
                console.log("Sending taskData", taskData);
                updateTask(taskId, card.id, taskData);
                setEditTask(false);
                setTaskId(null);
                setTaskTitle("");
                setTaskDescription("");
                setTaskAssignee("");
              }
            }}
            className="bg-blue-500 text-white font-semibold cursor-pointer w-full py-2 rounded hover:bg-blue-600"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskModal;
