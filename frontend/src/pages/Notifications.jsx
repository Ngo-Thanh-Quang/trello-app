import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
    const [invites, setInvites] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchInvites = async () => {
            try {
                const token = localStorage.getItem("tokenLogin");
                const res = await axios.get(`${backendUrl}/notifications`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setInvites(res.data);
            } catch (err) {
                console.error("Loi lay loi moi:", err);
            }
        };
        fetchInvites();
    }, []);

    // Send invitation status
    const sendInviteAction = async ({ board_id, invite_id, member_id, status, card_id }) => {
        const token = localStorage.getItem("tokenLogin");
        const payload = { invite_id, member_id, status };
        if (card_id) payload.card_id = card_id;
        return axios.post(
            `${backendUrl}/boards/${board_id}/invite/accept`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
        );
    };

    const handleAction = async (invite, status) => {
        try {
            const res = await sendInviteAction({
                board_id: invite.board_id,
                invite_id: invite.invite_id,
                member_id: invite.member_id,
                status,
                card_id: invite.card_id,
            });
            if (res.data && res.data.success) {
                alert(`Invitation ${status === 'accepted' ? 'accepted' : 'declined'}!`);
                setInvites(invites.filter((i) => i.invite_id !== invite.invite_id));
            } else {
                alert('An error occurred while updating the invitation!');
            }
        } catch (err) {
            alert('Failed to update invitation!');
            console.error("Failed to update invitation:", err);
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Invitation Notifications</h2>
            {invites.length === 0 ? (
                <div>No invitations.</div>
            ) : (
                <ul className="space-y-4">
                    {invites.map((invite) => (
                        <li key={invite.invite_id} className="bg-gray-100 p-4 rounded shadow flex justify-between items-center">
                            <div>
                                <div>You have been invited to board <span className="font-semibold">{invite.board_name}</span></div>
                                <div>Description: <span className="italic">{invite.board_description}</span></div>
                                <div>Board owner: {invite.board_owner_id}</div>
                                <div>Status: <span className="italic">{invite.status}</span></div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    onClick={() => handleAction(invite, "accepted")}
                                >
                                    Accept
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    onClick={() => handleAction(invite, "declined")}
                                >
                                    Decline
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notifications;