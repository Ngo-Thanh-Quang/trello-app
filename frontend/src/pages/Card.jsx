import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaLongArrowAltLeft, FaPlus } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Card = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoards] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState([]);
  const [form, setForm] = useState(false);
  const [title, setTitle] = useState("");

  const onDragEnd = (result) => {
    const { source, destination } = result;

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

      const newCard = { id: res.data.id, title: res.data.title, tasks: [] };
      setCard([...card, newCard]);
    } catch (err) {
      console.error("Error creating card:", err);
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

        const boardList = cardsRes.data.map((card) => ({
          id: card.id,
          title: card.title,
          tasks: [],
        }));

        setCard(boardList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching board/cards:", err);
      }
    };

    fetchBoardAndCards();
  }, [boardId]);

  return (
    <div className="absolute top-20 left-64 right-0 bottom-0 bg-white p-6 overflow-auto">
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
              <h3 className="font-bold py-2 text-2xl text-blue-700 capitalize">
                {board.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="text-gray-600 italic">{board.description}</div>
              </div>
            </div>
            <div className="flex -space-x-2 overflow-hidden">
              <img
                className="inline-block size-8 rounded-full ring-2 ring-white cursor-pointer"
                src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <img
                className="inline-block size-8 rounded-full ring-2 ring-white cursor-pointer"
                src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
                onClick={() => navigate("/")}
              />
              <img
                className="inline-block size-8 rounded-full ring-2 ring-white cursor-pointer"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                alt=""
              />
              <img
                className="inline-block size-8 rounded-full ring-2 ring-white cursor-pointer"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4 items-start">
              {card.map((card) => (
                <div
                  key={card.id}
                  className="w-64 flex-shrink-0 bg-gray-100 rounded-lg shadow p-3"
                >
                  <h4 className="font-bold mb-3">{card.title}</h4>
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
                                className="bg-white p-2 rounded shadow hover:shadow-md cursor-pointer"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {task.content}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <button className="mt-2 w-full cursor-pointer rounded-lg p-2 text-left flex items-center gap-2 hover:bg-gray-300">
                    <FaPlus className="text-sm" /> Add a task
                  </button>
                </div>
              ))}

              <button
                onClick={() => setForm(true)}
                className="w-64 flex-shrink-0 gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow p-2 flex items-center justify-center cursor-pointer"
              >
                <FaPlus className="text-sm" /> Add another card
              </button>
            </div>
          </DragDropContext>
          {form && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-10">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
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
        </div>
      )}
    </div>
  );
};

export default Card;
