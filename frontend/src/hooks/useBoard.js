import { useState, useEffect } from "react";
import {
    fetchBoards,
    fetchInvitedBoards,
    fetchBoardMembers,
    createBoard,
    editBoard,
    deleteBoard,
} from "../api/boardApi";
import { toast } from "react-toastify";

const useBoards = () => {
    const [boards, setBoards] = useState([]);
    const [invitedBoards, setInvitedBoards] = useState([]);
    const [selectedBoardId, setSelectedBoardId] = useState(null);
    const [boardMembers, setBoardMembers] = useState({});
    const token = localStorage.getItem("tokenLogin");

    useEffect(() => {
        const loadAll = async () => {
            if (!token) return;
            try {
                // Boards
                const resBoards = await fetchBoards(token);
                const boardList = resBoards.data || [];
                setBoards(boardList);

                // Invited
                const resInvited = await fetchInvitedBoards(token);
                setInvitedBoards(resInvited.data || []);

                // Members
                const memberResult = {};
                await Promise.all(
                    boardList.map(async (board) => {
                        try {
                            const res = await fetchBoardMembers(board.id);
                            memberResult[board.id] = res.data || [];
                        } catch {
                            memberResult[board.id] = [];
                        }
                    })
                );
                setBoardMembers(memberResult);
            } catch (err) {
                console.error("Error loading board data:", err);
                setBoards([]);
                setInvitedBoards([]);
            }
        };

        loadAll();
    }, [token]);

    const handleCreateBoard = async (data) => {
        try {
            await createBoard(data, token);
            toast.success("Board created!");
            await refreshAll();
        } catch (err) {
            toast.error("Create failed!");
        }
    };

    const handleEditBoard = async (id, data) => {
        try {
            await editBoard(id, data, token);
            toast.success("Board updated!");
            await refreshAll();
        } catch (err) {
            toast.error("Edit failed!");
        }
    };

    const handleDeleteBoard = async (id) => {
        try {
            await deleteBoard(id, token);
            toast.success("Board deleted!");
            await refreshAll();
        } catch (err) {
            toast.error("Delete failed!");
        }
    };

    const refreshAll = async () => {
        if (!token) return;
        try {
            const resBoards = await fetchBoards(token);
            const boardList = resBoards.data || [];
            setBoards(boardList);

            const memberResult = {};
            await Promise.all(
                boardList.map(async (board) => {
                    try {
                        const res = await fetchBoardMembers(board.id);
                        memberResult[board.id] = res.data || [];
                    } catch {
                        memberResult[board.id] = [];
                    }
                })
            );
            setBoardMembers(memberResult);
        } catch (err) {
            console.error("Refresh failed:", err);
        }
    };

    return {
        boards,
        invitedBoards,
        boardMembers,
        selectedBoardId,
        setSelectedBoardId,
        handleCreateBoard,
        handleEditBoard,
        handleDeleteBoard,
    };
};

export default useBoards;
