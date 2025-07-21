import axios from "axios";
import { db } from "../../firebase";
import {
  getDocs,
  query,
  collection,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const getToken = () => localStorage.getItem("tokenLogin");

export const listenToCardsWithTasks = (boardId, onUpdate) => {
  const cardQuery = query(
    collection(db, "cards"),
    where("boardId", "==", boardId)
  );
  const taskQuery = query(collection(db, "tasks"), orderBy("order", "asc"));

  const unsubCards = onSnapshot(cardQuery, async (cardSnap) => {
    const cards = cardSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      tasks: [],
    }));

    const cardsMap = {};
    for (const card of cards) {
      cardsMap[card.id] = card;
    }

    const taskSnap = await getDocs(
      query(collection(db, "tasks"), orderBy("order", "asc"))
    );
    taskSnap.forEach((doc) => {
      const task = { id: doc.id, ...doc.data() };
      if (cardsMap[task.cardId]) {
        cardsMap[task.cardId].tasks.push(task);
      }
    });

    const updatedCards = Object.values(cardsMap);
    onUpdate(updatedCards);
  });

  const unsubTasks = onSnapshot(taskQuery, async () => {
    const cardSnap = await getDocs(cardQuery);
    const cards = cardSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      tasks: [],
    }));

    const cardsMap = {};
    for (const card of cards) {
      cardsMap[card.id] = card;
    }

    const taskSnap = await getDocs(
      query(collection(db, "tasks"), orderBy("order", "asc"))
    );
    taskSnap.forEach((doc) => {
      const task = { id: doc.id, ...doc.data() };
      if (cardsMap[task.cardId]) {
        cardsMap[task.cardId].tasks.push(task);
      }
    });

    for (const cardId in cardsMap) {
      cardsMap[cardId].tasks.sort((a, b) => a.order - b.order); // thêm dòng này
    }

    const updatedCards = Object.values(cardsMap);
    onUpdate(updatedCards);
  });

  return () => {
    unsubCards();
    unsubTasks();
  };
};

export const fetchInvitedEmails = async (boardId) => {
  const token = getToken();
  const res = await axios.get(
    `${backendUrl}/boards/${boardId}/invited-emails`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const sendInvites = async (boardId, emails) => {
  const token = getToken();
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

export const fetchAcceptedMembers = async (boardId) => {
  const res = await fetch(`${backendUrl}/boards/${boardId}/accepted-members`);
  return res.json();
};

export const fetchBoard = async (boardId) => {
  const token = getToken();
  const res = await axios.get(`${backendUrl}/boards/${boardId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchCardsWithTasks = async (boardId) => {
  const token = getToken();
  const res = await axios.get(`${backendUrl}/cards/${boardId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const cards = await Promise.all(
    res.data.map(async (card) => {
      const taskRes = await axios.get(`${backendUrl}/tasks/${card.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { ...card, tasks: taskRes.data };
    })
  );
  return cards;
};

export const fetchCurrentUser = async () => {
  const token = getToken();
  const res = await axios.get(`${backendUrl}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.user;
};

export const fetchAllUsers = async () => {
  const token = getToken();
  const res = await axios.get(`${backendUrl}/authuser/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createCard = async (boardId, title) => {
  const token = getToken();
  const res = await axios.post(
    `${backendUrl}/cards`,
    { boardId, title },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const updateCard = async (cardId, title) => {
  const token = getToken();
  await axios.put(
    `${backendUrl}/cards/${cardId}`,
    { title },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const deleteCard = async (cardId) => {
  const token = getToken();
  await axios.delete(`${backendUrl}/cards/${cardId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addTask = async (cardId, content) => {
  const token = getToken();
  const res = await axios.post(
    `${backendUrl}/tasks/${cardId}`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const deleteTaskById = async (taskId) => {
  const token = getToken();
  await axios.delete(`${backendUrl}/tasks/delete/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateTaskById = async (taskId, taskData) => {
  const token = getToken();
  await axios.put(`${backendUrl}/tasks/update/${taskId}`, taskData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const moveTaskToCard = async (taskId, destCardId, order) => {
  const token = getToken();
  await axios.put(
    `${backendUrl}/tasks/update-card/${taskId}`,
    { cardId: destCardId, order },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
