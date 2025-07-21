import { useCallback, useEffect, useState } from "react";
import * as api from "../api/cardApi";
import { toast } from "react-toastify";

export const useCard = (boardId, showInvite) => {
  const [boardMembers, setBoardMembers] = useState({});
  const [board, setBoard] = useState({});
  const [cards, setCards] = useState([]);
  const [newTask, setNewTask] = useState([]);
  const [owner, setOwner] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [alreadyInvited, setAlreadyInvited] = useState([]);
  const [cardTitle, setCardTitle] = useState("");
  const [create, setCreate] = useState("");
  const [taskAssignee, setTaskAssignee] = useState([]);
  const [taskStatus, setTaskStatus] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!boardId) return;

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const members = await api.fetchAcceptedMembers(boardId);
        setBoardMembers({ [boardId]: members });

        const boardInfo = await api.fetchBoard(boardId);
        setBoard(boardInfo);
        setOwner(boardInfo.userEmail);

        const cardsData = await api.fetchCardsWithTasks(boardId);
        setCards(cardsData);

        const user = await api.fetchCurrentUser();
        setCurrentUser(user.email);

        const users = await api.fetchAllUsers();
        setAllUsers(users);
      } catch (err) {
        console.error("Error fetching board data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    const unsubscribe = api.listenToCardsWithTasks(boardId, (liveCards) => {
      if (!isDragging) {
        setCards(liveCards);
      }
    });

    return () => unsubscribe();
  }, [boardId]);

  useEffect(() => {
    const fetchInvites = async () => {
      if (!boardId || !showInvite) return;
      try {
        const invited = await api.fetchInvitedEmails(boardId);
        setAlreadyInvited(invited);
      } catch (err) {
        console.error("Error fetching invited users:", err);
      }
    };

    fetchInvites();
  }, [boardId, showInvite]);

  const addCard = async (boardId, title) => {
    if (!title) return;

    try {
      const data = await api.createCard(boardId, title);
      const newCard = {
        id: data.id,
        title: data.title,
        createdAt: data.createdAt,
        tasks: [],
      };
      setCards([...cards, newCard]);
      toast.success("Card created successfully");
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  const detailCard = (card, showDetail) => {
    setCardTitle(card.title);
    setCreate(card.createdAt);
    if (typeof showDetail === "function") {
      showDetail(true);
    }
  };

  const updateCard = async (cardId, title) => {
    await api.updateCard(cardId, title);
    setCards((prev) =>
      prev.map((card) => (card.id === cardId ? { ...card, title } : card))
    );
    toast.success("Card updated");
  };

  const deleteCard = async (cardId) => {
    await api.deleteCard(cardId);
    setCards((prev) => prev.filter((card) => card.id !== cardId));
    toast.success("Card deleted");
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    setIsDragging(true);

    if (!destination) return;

    const sourceCard = cards.find((card) => card.id === source.droppableId);
    const destCard = cards.find((card) => card.id === destination.droppableId);

    const sourceTasks = [...sourceCard.tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, movedTask);

      const updatedTasks = sourceTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      for (const task of updatedTasks) {
        await api.updateTaskById(task.id, {
          title: task.title,
          description: task.description,
          status: task.status,
          assignee: task.assignee,
          order: task.order,
        });
      }

      const updatedCard = cards.map((card) =>
        card.id === sourceCard.id ? { ...card, tasks: sourceTasks } : card
      );
      setCards(updatedCard);

      await api.updateTaskById(draggableId, {
        title: movedTask.title,
        description: movedTask.description,
        status: movedTask.status,
        assignee: movedTask.assignee,
        order: destination.index,
      });
    } else {
      const destTasks = [...destCard.tasks];
      destTasks.splice(destination.index, 0, movedTask);

      const updatedSourceTasks = sourceTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      const updatedDestTasks = destTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      const updatedCard = cards.map((card) => {
        if (card.id === sourceCard.id)
          return { ...card, tasks: updatedSourceTasks };
        if (card.id === destCard.id)
          return { ...card, tasks: updatedDestTasks };
        return card;
      });
      setCards(updatedCard);
      for (const task of updatedDestTasks) {
        await api.updateTaskById(task.id, {
          title: task.title,
          description: task.description,
          status: task.status,
          assignee: task.assignee,
          order: task.order,
        });
      }

      try {
        await api.moveTaskToCard(
          draggableId,
          destination.droppableId,
          destination.index
        );
      } catch (err) {
        console.error("Failed to move task:", err);
      }
    }

    setIsDragging(false);
  };

  const detailTask = (task, setShowDetailTask) => {
    setTaskAssignee(task.assignee);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskStatus(task.status);
    if (typeof setShowDetailTask === "function") {
      setShowDetailTask(true);
    }
  };

  const addTask = async (cardId, taskContent) => {
    if (!taskContent) return;

    try {
      const newTask = await api.addTask(cardId, taskContent);

      const updatedCards = cards.map((c) =>
        c.id === cardId ? { ...c, tasks: [...c.tasks, newTask] } : c
      );

      setCards(updatedCards);
      setNewTask("");
      toast.success("Task created");
    } catch (err) {
      console.error("Failed to create task:", err);
      toast.error("Failed to create task");
    }
  };

  const deleteTask = async (taskId, cardId) => {
    await api.deleteTaskById(taskId);
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? { ...card, tasks: card.tasks.filter((t) => t.id !== taskId) }
          : card
      )
    );
    toast.success("Task deleted");
  };

  const updateTask = async (taskId, cardId, taskData) => {
    await api.updateTaskById(taskId, taskData);
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              tasks: card.tasks.map((t) =>
                t.id === taskId ? { ...t, ...taskData } : t
              ),
            }
          : card
      )
    );
    toast.success("Task updated");
  };

  const sendInvites = useCallback(
    async (emails) => {
      await api.sendInvites(boardId, emails);
    },
    [boardId]
  );

  return {
    cardTitle,
    setCardTitle,
    create,
    detailCard,
    loading,
    boardMembers,
    board,
    cards,
    setCards,
    owner,
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
    setAlreadyInvited,
    setBoardMembers,
    addCard,
    updateCard,
    deleteCard,
    addTask,
    onDragEnd,
    detailTask,
    setNewTask,
    deleteTask,
    updateTask,
    sendInvites,
  };
};
