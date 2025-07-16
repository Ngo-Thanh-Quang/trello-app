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
                console.error("Lỗi lấy lời mời:", err);
            }
        };
        fetchInvites();
    }, []);

    const handleAction = async (invite, status) => {
        try {
            const token = localStorage.getItem("tokenLogin");
            const res = await axios.post(
                `${backendUrl}/boards/${invite.board_id}/invite/accept`,
                {
                    invite_id: invite.invite_id,
                    card_id: invite.card_id || '',
                    member_id: invite.member_id,
                    status,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data && res.data.success) {
                alert(`Đã ${status === 'accepted' ? 'chấp nhận' : 'từ chối'} lời mời!`);
                setInvites(invites.filter((i) => i.invite_id !== invite.invite_id));
            } else {
                alert('Có lỗi xảy ra khi cập nhật lời mời!');
            }
        } catch (err) {
            alert('Lỗi cập nhật lời mời!');
            console.error("Lỗi cập nhật lời mời:", err);
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Thông báo lời mời</h2>
            {invites.length === 0 ? (
                <div>Không có lời mời nào.</div>
            ) : (
                <ul className="space-y-4">
                    {invites.map((invite) => (
                        <li key={invite.invite_id} className="bg-gray-100 p-4 rounded shadow flex justify-between items-center">
                            <div>
                                <div>Ban duoc moi vao bang <span className="font-semibold">{invite.board_id}</span></div>
                                <div>Nguoi tao bang: {invite.email_member}</div>
                                <div>Trạng thái: <span className="italic">{invite.status}</span></div>
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