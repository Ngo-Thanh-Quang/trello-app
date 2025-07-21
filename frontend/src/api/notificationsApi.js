import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("tokenLogin");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchInvitations = async () => {
  return await axios.get(`${backendUrl}/notifications`, getAuthHeader());
};

export const respondToInvitation = async ({ board_id, invite_id, member_id, status, card_id }) => {
  const payload = { invite_id, member_id, status };
  if (card_id) payload.card_id = card_id;

  return await axios.post(`${backendUrl}/boards/${board_id}/invite/accept`, payload, getAuthHeader());
};
