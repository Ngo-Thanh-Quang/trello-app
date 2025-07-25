import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaLongArrowAltLeft,
  FaPlus,
  FaEllipsisV,
  FaTrashAlt,
  FaEdit,
  FaInfoCircle,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Card = () => {
  const [boardMembers, setBoardMembers] = useState({});
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoards] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState([]);
  const [form, setForm] = useState(false);
  const [title, setTitle] = useState("");
  const [edit, setEdit] = useState(false);
  const [selectCard, setSelectCard] = useState(null);
  const [cardTitle, setCardTitle] = useState("");
  const [detail, showDetail] = useState(false);
  const [create, setCreate] = useState("");
  const [selectTask, setSelectTask] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [editTask, setEditTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [taskAssignee, setTaskAssginee] = useState("");
  const [detailTask, setDetailTask] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [inviteEmails, setInviteEmails] = useState([]);
  const [alreadyInvited, setAlreadyInvited] = useState([]);
  const [owner, setOwner] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/boards/${boardId}/accepted-members`
        );
        const members = await res.json();
        setBoardMembers({ [boardId]: members });
      } catch (e) {
        setBoardMembers({ [boardId]: [] });
      }
    };
    if (boardId) fetchMembers();
  }, [boardId, backendUrl]);

  const fetchInvitedEmails = async () => {
    try {
      const token = localStorage.getItem("tokenLogin");
      const res = await axios.get(
        `${backendUrl}/boards/${boardId}/invited-emails`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAlreadyInvited(res.data);
    } catch (err) {
      setAlreadyInvited([]);
    }
  };

  useEffect(() => {
    if (showInvite) {
      fetchInvitedEmails();
    }
  }, [showInvite, boardId]);

  const sendInvites = async (emails) => {
    const token = localStorage.getItem("tokenLogin");
    await Promise.all(
      emails.map((email) =>
        axios.post(
          `${backendUrl}/boards/${boardId}/invite`,
          {
            member_id: Date.now().toString(),
            email_member: email,
            status: "pending",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      )
    );
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const sourceCard = card.find((card) => card.id === source.droppableId);
    const destCard = card.find((card) => card.id === destination.droppableId);

    const sourceTasks = [...sourceCard.tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, movedTask);
      const updatedCard = card.map((card) =>
        card.id === sourceCard.id ? { ...card, tasks: sourceTasks } : card
      );
      setCard(updatedCard);
    } else {
      const destTasks = [...destCard.tasks];
      destTasks.splice(destination.index, 0, movedTask);
      const updatedCard = card.map((card) => {
        if (card.id === sourceCard.id) return { ...card, tasks: sourceTasks };
        if (card.id === destCard.id) return { ...card, tasks: destTasks };
        return card;
      });
      setCard(updatedCard);

      try {
        const token = localStorage.getItem("tokenLogin");
        await axios.put(
          `${backendUrl}/tasks/update-card/${draggableId}`,
          { cardId: destination.droppableId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Failed to move task:", err);
      }
    }
  };

  const addCard = async () => {
    if (!title) return;

    setTitle("");
    setForm(false);
    try {
      const token = localStorage.getItem("tokenLogin");
      const res = await axios.post(
        `${backendUrl}/cards`,
        { boardId, title },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newCard = {
        id: res.data.id,
        title: res.data.title,
        createdAt: res.data.createdAt,
        tasks: [],
      };
      setCard([...card, newCard]);
      toast.success("Card created successfully");
    } catch (err) {
      console.error("Error creating card:", err);
    }
  };

  const updateCard = async () => {
    if (!cardTitle) return;

    setCardTitle("");
    setEdit(false);
    try {
      const token = localStorage.getItem("tokenLogin");
      await axios.put(
        `${backendUrl}/cards/${selectCard}`,
        { title: cardTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedCard = card.map((c) =>
        c.id === selectCard ? { ...c, title: cardTitle } : c
      );
      setCard(updatedCard);
      toast.success("Card updated successfully");
      setSelectCard(null);
    } catch (err) {
      toast.error("Error updating card");
      console.error("Error updating card:", err);
    }
  };

  const deleteCard = async (cardId) => {
    try {
      const token = localStorage.getItem("tokenLogin");
      await axios.delete(`${backendUrl}/cards/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCard(card.filter((c) => c.id !== cardId));
      toast.success("Card deleted successfully");
    } catch (err) {
      console.error("Error deleting card:", err);
    }
  };

  const addTask = async (cardId) => {
    if (!newTask) return;
    const token = localStorage.getItem("tokenLogin");
    try {
      const res = await axios.post(
        `${backendUrl}/tasks/${cardId}`,
        { content: newTask },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedCards = card.map((c) =>
        c.id === cardId ? { ...c, tasks: [...c.tasks, res.data] } : c
      );
      setCard(updatedCards);
      setNewTask("");
      setSelectTask(null);
      toast.success("Task created");
    } catch (err) {
      console.error("Failed to create task:", err);
      toast.error("Failed to create task");
    }
  };

  const deleteTask = async (taskDelete, cardId) => {
    try {
      const token = localStorage.getItem("tokenLogin");
      await axios.delete(`${backendUrl}/tasks/delete/${taskDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updateCard = card.map((c) =>
        c.id === cardId
          ? { ...c, tasks: c.tasks.filter((task) => task.id !== taskDelete) }
          : c
      );

      setCard(updateCard);
      toast.success("Task deleted successfully");
    } catch (err) {
      console.error("Failed to delete task:", err);
      toast.error("Failed to delete task");
    }
  };

  const updateTask = async () => {
    if (!taskTitle) return;
    const token = localStorage.getItem("tokenLogin");

    try {
      await axios.put(
        `${backendUrl}/tasks/update/${taskId}`,
        {
          title: taskTitle,
          description: taskDescription,
          status: taskStatus,
          assignee: taskAssignee,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedCard = card.map((c) => ({
        ...c,
        tasks: c.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                title: taskTitle,
                description: taskDescription,
                status: taskStatus,
                assignee: taskAssignee,
              }
            : t
        ),
      }));
      setCard(updatedCard);

      toast.success("Task updated successfully");
      setEditTask(false);
      setTaskId(null);
      setTaskTitle("");
      setTaskDescription("");
      setTaskAssginee("");
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Update task error:", err);
    }
  };

  useEffect(() => {
    const fetchBoardAndCards = async () => {
      try {
        const token = localStorage.getItem("tokenLogin");

        const boardRes = await axios.get(`${backendUrl}/boards/${boardId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const cardsRes = await axios.get(`${backendUrl}/cards/${boardId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBoards(boardRes.data);
        setOwner(boardRes.data.userEmail);
        console.log("owner: ", boardRes.data.userEmail);

        const boardList = await Promise.all(
          cardsRes.data.map(async (card) => {
            const tasksRes = await axios.get(`${backendUrl}/tasks/${card.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            return {
              id: card.id,
              title: card.title,
              createdAt: card.createdAt,
              tasks: tasksRes.data,
            };
          })
        );

        setCard(boardList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching board/cards:", err);
      }
    };
    fetchBoardAndCards();

    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("tokenLogin");
        const res = await axios.get(`${backendUrl}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200) {
          setCurrentUser(res.data.user.email);
          console.log("current:", res.data.user.email);
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null);
      }
    };
    fetchCurrentUser();

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("tokenLogin");
        const res = await axios.get(`${backendUrl}/authuser/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllUsers(res.data);
      } catch (err) {
        setAllUsers([]);
      }
    };
    fetchUsers();

    const handleClose = (e) => {
      if (!e.target.closest(".close")) {
        setSelectCard(null);
        setSelectTask(null);
        setForm(false);
        setEdit(false);
        showDetail(false);
        setTaskId(null);
        setEditTask(false);
        setDetailTask(false);
      }
    };
    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, [boardId]);

  return (
    <div className="absolute top-20 left-0 md:left-64 right-0 bottom-0 bg-white p-6 overflow-auto">
      <button
        className="px-5 py-2 flex gap-2 cursor-pointer items-center text-base bg-blue-400 hover:bg-blue-600 text-white rounded-lg font-semibold mb-4"
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
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold py-2 text-lg md:text-2xl text-blue-700 capitalize">
                {board.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="text-gray-600 italic">{board.description}</div>
              </div>
              {showInvite && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-20">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-75 sm:w-96 relative">
                    <div
                      className="absolute flex right-3 top-2 cursor-pointer"
                      onClick={() => setShowInvite(false)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                    <h2 className="text-xl font-bold mb-4 text-center">
                      Invite Members
                    </h2>
                    <div className="mb-4">
                      <div className="font-semibold mb-2">
                        Select emails to invite:
                      </div>
                      <div className="max-h-40 overflow-y-auto border rounded p-2">
                        {allUsers.length === 0 ||
                        allUsers.filter(
                          (email) =>
                            email !== board.userEmail &&
                            !alreadyInvited.includes(email)
                        ).length === 0 ? (
                          <div>No users available to invite.</div>
                        ) : (
                          allUsers
                            .filter(
                              (email) =>
                                email !== board.userEmail &&
                                !alreadyInvited.includes(email)
                            )
                            .map((email) => (
                              <label
                                key={email}
                                className="flex items-center gap-2 mb-1"
                              >
                                <input
                                  type="checkbox"
                                  checked={inviteEmails.includes(email)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setInviteEmails([...inviteEmails, email]);
                                    } else {
                                      setInviteEmails(
                                        inviteEmails.filter(
                                          (em) => em !== email
                                        )
                                      );
                                    }
                                  }}
                                />
                                <span>{email}</span>
                              </label>
                            ))
                        )}
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        if (inviteEmails.length === 0) return;
                        try {
                          await sendInvites(inviteEmails);
                          setShowInvite(false);
                          setInviteEmails([]);
                          alert("Đã gửi lời mời thành công!");
                        } catch (err) {
                          alert("Gửi lời mời thất bại!");
                        }
                      }}
                      className="bg-blue-500 text-white font-semibold cursor-pointer w-full py-2 rounded hover:bg-blue-600"
                    >
                      Send Invite
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex -space-x-2 items-center">
              <button
                className="w-10 md:w-16 flex-shrink-0 gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow p-2 flex items-center justify-center cursor-pointer"
                onClick={() => setShowInvite(true)}
              >
                <FaPlus />
              </button>

              {boardMembers[boardId] &&
                boardMembers[boardId].length > 0 &&
                boardMembers[boardId].map((m, idx) => (
                  <img
                    key={m.email || idx}
                    className="inline-block size-8 md:size-10 rounded-full ring-2 ring-white cursor-pointer"
                    src={
                      m.picture || "https://ui-avatars.com/api/?name=" + m.name
                    }
                    alt={m.name || m.email}
                  />
                ))}
            </div>
          </div>
          {card.length > 0 ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-4 overflow-x-auto pb-4 items-start">
                {card.map((card) => (
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
                      onClick={() => {
                        setCardTitle(card.title);
                        setCreate(card.createdAt);
                        showDetail(true);
                      }}
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
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
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
                                          setDetailTask(true);
                                          setTaskAssginee(task.assignee);
                                          setTaskTitle(task.title);
                                          setTaskDescription(task.description);
                                          setTaskStatus(task.status);
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
                    {selectTask === card.id ? (
                      <div className="mt-2 close">
                        <input
                          className="input p-2 mb-2 bg-white w-full"
                          placeholder="Task title"
                          value={newTask}
                          onChange={(e) => setNewTask(e.target.value)}
                        />
                        <button
                          className="w-[40%] cursor-pointer font-medium rounded-lg p-2 text-center flex items-center gap-2 text-white bg-blue-600 transition hover:bg-blue-500"
                          onClick={() => addTask(card.id)}
                        >
                          Add Task
                        </button>
                      </div>
                    ) : (
                      currentUser === owner && (
                        <button
                          onClick={() => setSelectTask(card.id)}
                          className="mt-2 w-full cursor-pointer rounded-lg p-2 text-left flex items-center gap-2 hover:bg-gray-300"
                        >
                          <FaPlus className="text-sm" /> Add a task
                        </button>
                      )
                    )}
                  </div>
                ))}

                {currentUser === owner && (
                  <button
                    onClick={() => setForm(true)}
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
                  onClick={() => setForm(true)}
                  className="w-64 flex-shrink-0 gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow p-2 flex items-center justify-center cursor-pointer"
                >
                  <FaPlus className="text-sm" /> Add another card
                </button>
              )}
            </div>
          )}
          {/* Creating a new card */}
          {form && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-10">
              <div className="bg-white p-6 rounded-lg shadow-lg w-75 sm:w-96 relative close">
                <div
                  className="absolute flex right-3 top-2 cursor-pointer"
                  onClick={() => setForm(false)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </div>
                <h2 className="text-xl font-bold mb-4 text-center">
                  Create New Card
                </h2>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter card title"
                  className="input mb-4 w-full focus:outline-none"
                />
                <button
                  onClick={addCard}
                  className="bg-blue-500 text-white font-semibold cursor-pointer w-full py-2 rounded hover:bg-blue-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
          {/* Edit card */}
          {edit && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-10">
              <div className="bg-white p-6 rounded-lg shadow-lg w-75 sm:w-96 relative close">
                <div
                  className="absolute flex right-3 top-2 cursor-pointer"
                  onClick={() => {
                    setEdit(false), setSelectCard(null);
                  }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </div>
                <h2 className="text-xl font-bold mb-4 text-center">
                  Edit Card
                </h2>
                <input
                  type="text"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  placeholder="Enter card title"
                  className="input mb-4 w-full focus:outline-none"
                />
                <button
                  onClick={updateCard}
                  className="bg-blue-500 text-white font-semibold cursor-pointer w-full py-2 rounded hover:bg-blue-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
          {/* Card detail*/}
          {detail && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-10">
              <div className="bg-white p-6 rounded-lg shadow-lg w-75 sm:w-96 relative close">
                <div
                  className="absolute flex right-3 top-2 cursor-pointer"
                  onClick={() => showDetail(false)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </div>
                <h2 className="text-xl font-bold mb-4 text-center">
                  Card Information
                </h2>
                <div className="flex gap-2">
                  <div>
                    <p className="p-2 font-semibold">Name:</p>
                    <p className="p-2 font-semibold">Created at:</p>
                  </div>
                  <div>
                    <p className="p-2 text-gray-600 font-semibold italic capitalize">
                      {cardTitle}
                    </p>
                    <p className="p-2 text-gray-600 font-semibold italic">
                      {create}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Edit task */}
          {editTask && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-10">
              <div className="bg-white p-6 rounded-lg shadow-lg w-75 sm:w-96 relative close">
                <div
                  className="absolute flex right-3 top-2 cursor-pointer"
                  onClick={() => {
                    setEditTask(false);
                    setTaskId(null);
                    setTaskTitle("");
                    setTaskDescription("");
                    setTaskAssginee("");
                  }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </div>
                <h2 className="text-xl font-bold mb-4 text-center">
                  Edit Task
                </h2>
                <label for="members" className="p-2 pr-5 font-semibold">
                  Assignee:
                </label>
                <select
                  className="p-2"
                  name="members"
                  value={taskAssignee}
                  onChange={(e) => setTaskAssginee(e.target.value)}
                >
                  {boardMembers[boardId] &&
                    boardMembers[boardId].length > 0 &&
                    boardMembers[boardId].map((m, idx) => (
                      <option key={m.email} value={m.name}>
                        {m.name}
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
                  onClick={updateTask}
                  className="bg-blue-500 text-white font-semibold cursor-pointer w-full py-2 rounded hover:bg-blue-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
          {/* Task detail */}
          {detailTask && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-10">
              <div className="bg-white p-6 rounded-lg shadow-lg w-75 sm:w-96 relative close">
                <div
                  className="absolute flex right-3 top-2 cursor-pointer"
                  onClick={() => {
                    setDetailTask(false), setTaskId(null);
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
                      {taskAssignee || "Unassigned"}
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
