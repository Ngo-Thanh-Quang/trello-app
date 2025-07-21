import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const fetchBoards = async (token) => {
  return await axios.get(`${backendUrl}/boards`, getAuthHeader(token));
};

export const fetchInvitedBoards = async (token) => {
  return await axios.get(`${backendUrl}/boards/invited-accepted`, getAuthHeader(token));
};

export const createBoard = async (data, token) => {
  return await axios.post(`${backendUrl}/boards`, data, getAuthHeader(token));
};

export const editBoard = async (id, data, token) => {
  return await axios.put(`${backendUrl}/boards/${id}`, data, getAuthHeader(token));
};

export const deleteBoard = async (id, token) => {
  return await axios.delete(`${backendUrl}/boards/${id}`, getAuthHeader(token));
};

export const fetchBoardMembers = async (boardId) => {
  return await axios.get(`${backendUrl}/boards/${boardId}/accepted-members`);
}

export const removeBoardMember = async (boardId, inviteId, token) => {
  return await axios.delete(`${backendUrl}/boards/${boardId}/accepted-members/${inviteId}`, getAuthHeader(token));
};
