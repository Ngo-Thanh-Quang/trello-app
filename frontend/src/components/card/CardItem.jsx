import React from "react";
import { FaPlus, FaEllipsisV, FaEdit, FaTrashAlt } from "react-icons/fa";
import { Droppable } from "@hello-pangea/dnd";
import TaskModal from "../task/TaskModal";
import TaskItem from "../task/TaskItem";

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
  setTaskDescription,
  setTaskAssignee,
  deleteTask,
  detailTask,
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
              <TaskItem
                key={task.id}
                task={task}
                card={card}
                index={index}
                currentUser={currentUser}
                owner={owner}
                taskId={taskId}
                setTaskId={setTaskId}
                detailTask={detailTask}
                setShowDetailTask={setShowDetailTask}
                setEditTask={setEditTask}
                setTaskTitle={setTaskTitle}
                setTaskDescription={setTaskDescription}
                setTaskAssignee={setTaskAssignee}
                deleteTask={deleteTask}
              />
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
