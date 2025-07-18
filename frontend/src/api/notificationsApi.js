import axios from "axios";
import { head } from "../../../backend/routes/boardRoute";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const getAuthHeader = (token) => ({
    headers: { Authorization: `Bearer ${token}` },
});

export const respondToInvitation  = async ({ board_id, invite_id, member_id, status, card_id }) => {
    const payload = { invite_id, member_id, status };
    if (card_id) payload.card_id = card_id;
    
    return axios.post(`${backendUrl}/boards/${board_id}/invite/accept`, payload, getAuthHeader(token)
);
};