import React from "react";
import { FaInfoCircle, FaEdit, FaTrashAlt } from "react-icons/fa";
import { Draggable } from "@hello-pangea/dnd";

const TaskItem = ({
  card,
  task,
  index,
  currentUser,
  owner,
  taskId,
  setTaskId,
  detailTask,
  setShowDetailTask,
  setEditTask,
  setTaskTitle,
  setTaskDescription,
  setTaskAssignee,
  deleteTask,
}) => {
  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => (
        <div
          onClick={() => setTaskId(task.id)}
          className="bg-white p-2 relative rounded shadow hover:shadow-md cursor-pointer"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <span>{task.title}</span>
          {taskId === task.id && (
            <div className="absolute left-full top-0 ml-2 z-10 bg-white text-gray-500 rounded shadow-md w-32 close">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer gap-2"
                onClick={() => {
                  detailTask(task, setShowDetailTask);
                  setTaskId(null);
                }}
              >
                <FaInfoCircle /> Detail
              </button>
              {currentUser === owner && (
                <div>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer gap-2"
                    onClick={() => {
                      setEditTask(true);
                      setTaskTitle(task.title);
                      setTaskDescription(task.description);
                      setTaskAssignee(task.assignee);
                      setTaskId(null);
                    }}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer gap-2"
                    onClick={() => {
                      deleteTask(task.id, card.id);
                      setTaskId(null);
                    }}
                  >
                    <FaTrashAlt /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;
