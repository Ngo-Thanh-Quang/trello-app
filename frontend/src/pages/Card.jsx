import React, { useEffect, useState } from "react";
import { FaLongArrowAltLeft, FaPlus } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useCard } from "../hooks/useCard";
import TaskModal from "../components/task/TaskModal";
import CardModal from "../components/card/CardModal";
import CardHeader from "../components/card/CardHeader";
import CardItem from "../components/card/CardItem";

const Card = () => {
  const { boardId } = useParams();
  const [showInvite, setShowInvite] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState(false);
  const [selectCard, setSelectCard] = useState(null);
  const [createTask, openCreateTask] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [detail, showDetail] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editTask, setEditTask] = useState(false);
  const [showDetailTask, setShowDetailTask] = useState(false);
  const [inviteEmails, setInviteEmails] = useState([]);

  const {
    loading,
    boardMembers,
    board,
    cards,
    owner,
    cardTitle,
    setCardTitle,
    create,
    currentUser,
    allUsers,
    alreadyInvited,
    taskAssignee,
    setTaskAssignee,
    taskStatus,
    setTaskStatus,
    taskDescription,
    setTaskDescription,
    taskTitle,
    setTaskTitle,
    detailCard,
    addCard,
    updateCard,
    deleteCard,
    onDragEnd,
    detailTask,
    deleteTask,
    addTask,
    updateTask,
    sendInvites,
  } = useCard(boardId, showInvite);

  useEffect(() => {
    const handleClose = (e) => {
      if (!e.target.closest(".close")) {
        setSelectCard(null);
        openCreateTask(null);
        setForm(false);
        setEdit(false);
        showDetail(false);
        setEditTask(false);
        setShowDetailTask(false);
        setTaskId(null);
      }
    };
    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, [showInvite, boardId]);

  return (
    <div className="absolute top-20 left-0 md:left-64 right-0 bottom-0 bg-white p-6 overflow-auto">
      <button
        className="px-5 py-2 flex gap-2 cursor-pointer items-center text-base bg-blue-700 hover:bg-blue-500 duration-300 text-white rounded-lg font-semibold mb-4"
        onClick={() => navigate("/")}
      >
        <FaLongArrowAltLeft />{" "}
        <span className="md:block hidden">Return Board List</span>
      </button>
      {loading ? (
        <div className="flex justify-center mt-5">
          <div className="loader border-t-4 border-blue-500 border-solid rounded-full h-10 w-10 animate-spin"></div>
        </div>
      ) : (
        <div>
          <CardHeader
            board={board}
            boardId={boardId}
            showInvite={showInvite}
            setShowInvite={setShowInvite}
            allUsers={allUsers}
            alreadyInvited={alreadyInvited}
            inviteEmails={inviteEmails}
            setInviteEmails={setInviteEmails}
            sendInvites={sendInvites}
            boardMembers={boardMembers}
          />
          {cards.length > 0 ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-4 overflow-x-auto pb-4 items-start">
                {cards.map((card) => (
                  <CardItem
                    key={card.id}
                    card={card}
                    currentUser={currentUser}
                    owner={owner}
                    selectCard={selectCard}
                    setSelectCard={setSelectCard}
                    setCardTitle={setCardTitle}
                    setEdit={setEdit}
                    deleteCard={deleteCard}
                    detailCard={detailCard}
                    taskId={taskId}
                    setTaskId={setTaskId}
                    taskTitle={taskTitle}
                    setTaskTitle={setTaskTitle}
                    taskDescription={taskDescription}
                    setTaskDescription={setTaskDescription}
                    taskAssignee={taskAssignee}
                    setTaskAssignee={setTaskAssignee}
                    deleteTask={deleteTask}
                    detailTask={detailTask}
                    editTask={editTask}
                    setEditTask={setEditTask}
                    createTask={createTask}
                    openCreateTask={openCreateTask}
                    addTask={addTask}
                    showDetail={showDetail}
                    setShowDetailTask={setShowDetailTask}
                  />
                ))}

                {currentUser === owner && (
                  <button
                    onClick={() => {
                      setForm(true);
                      setCardTitle("");
                    }}
                    className="w-64 flex-shrink-0 gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow p-2 flex items-center justify-center cursor-pointer"
                  >
                    <FaPlus className="text-sm" /> Add another card
                  </button>
                )}
              </div>
            </DragDropContext>
          ) : (
            <div>
              <div className="text-center text-gray-500 mb-5">
                No cards available. Click the button below to create a new card.
              </div>
              {currentUser === owner && (
                <button
                  onClick={() => {
                    setForm(true);
                    setCardTitle("");
                  }}
                  className="w-64 flex-shrink-0 gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow p-2 flex items-center justify-center cursor-pointer"
                >
                  <FaPlus className="text-sm" /> Add another card
                </button>
              )}
            </div>
          )}
          {/* Creating a new card */}
          {form && (
            <CardModal
              mode="create"
              cardTitle={cardTitle}
              setCardTitle={setCardTitle}
              addCard={addCard}
              setForm={setForm}
            />
          )}
          {/* Edit card */}
          {edit && (
            <CardModal
              mode="edit"
              cardTitle={cardTitle}
              setCardTitle={setCardTitle}
              setEdit={setEdit}
              selectCard={selectCard}
              setSelectCard={setSelectCard}
              updateCard={updateCard}
            />
          )}
          {/* Card detail*/}
          {detail && (
            <CardModal
              mode="detail"
              cardTitle={cardTitle}
              create={create}
              showDetail={showDetail}
            />
          )}
          {/* Edit task */}
          {editTask && (
            <TaskModal
              mode="edit"
              boardId={boardId}
              boardMembers={boardMembers}
              taskTitle={taskTitle}
              setTaskTitle={setTaskTitle}
              taskDescription={taskDescription}
              setTaskDescription={setTaskDescription}
              taskAssignee={taskAssignee}
              setTaskAssignee={setTaskAssignee}
              taskStatus={taskStatus}
              setTaskStatus={setTaskStatus}
              setEditTask={setEditTask}
              setTaskId={setTaskId}
              cards={cards}
              taskId={taskId}
              updateTask={updateTask}
            />
          )}
          {/* Task detail */}
          {showDetailTask && (
            <TaskModal
              mode="detail"
              taskTitle={taskTitle}
              taskDescription={taskDescription}
              taskStatus={taskStatus}
              taskAssignee={taskAssignee}
              setShowDetailTask={setShowDetailTask}
              setTaskId={setTaskId}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
