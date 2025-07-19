// components/CardItem.jsx
import React from "react";
import {
  FaPlus,
  FaEllipsisV,
  FaEdit,
  FaTrashAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskModal from "./TaskModal";

const CardItem = ({
  card,
  currentUser,
  owner,
  selectCard,
  setSelectCard,
  setCardTitle,
  setEdit,
  deleteCard,
  detailCard,
  taskId,
  setTaskId,
  taskTitle,
  setTaskTitle,
  taskDescription,
  setTaskDescription,
  taskAssignee,
  setTaskAssignee,
  deleteTask,
  detailTask,
  editTask,
  setEditTask,
  createTask,
  openCreateTask,
  addTask,
  showDetail,
  setShowDetailTask,
}) => {
  return (
    <div
      key={card.id}
      className="w-64 flex-shrink-0 bg-gray-100 rounded-lg shadow p-3 relative border border-gray-100 hover:border-gray-200 cursor-pointer"
    >
      {currentUser === owner && (
        <div className="absolute right-3 top-3 cursor-pointer text-gray-500 close">
          <FaEllipsisV onClick={() => setSelectCard(card.id)} />

          {selectCard === card.id && (
            <div className="absolute top-full right-0 mt-2 bg-white rounded shadow-md z-10 min-w-[120px]">
              <button
                className="flex gap-2 items-center w-full cursor-pointer text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setCardTitle(card.title);
                  setEdit(true);
                }}
              >
                <FaEdit /> Edit
              </button>
              <button
                className="flex gap-2 items-center w-full cursor-pointer text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  deleteCard(card.id);
                  setSelectCard(null);
                }}
              >
                <FaTrashAlt /> Delete
              </button>
            </div>
          )}
        </div>
      )}

      <h4
        onClick={() => detailCard(card, showDetail)}
        className="font-bold mb-3 capitalize"
      >
        {card.title}
      </h4>
      <Droppable droppableId={card.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2 min-h-[5px]"
          >
            {card.tasks.map((task, index) => (
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
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {createTask === card.id ? (
        <TaskModal
          mode="create"
          taskTitle={taskTitle}
          setTaskTitle={setTaskTitle}
          createTask={createTask}
          openCreateTask={openCreateTask}
          addTask={addTask}
        />
      ) : (
        currentUser === owner && (
          <button
            onClick={() => {
              openCreateTask(card.id);
              setTaskTitle("");
            }}
            className="mt-2 w-full cursor-pointer rounded-lg p-2 text-left flex items-center gap-2 hover:bg-gray-300"
          >
            <FaPlus className="text-sm" /> Add a task
          </button>
        )
      )}
    </div>
  );
};

export default CardItem;
