import { useState, useEffect } from "react";
import {
    fetchBoards,
    fetchInvitedBoards,
    createBoard,
    editBoard,
    deleteBoard,
} from "../api/boardApi";
import { toast } from "react-toastify";

const useBoards = () => {
    const [boards, setBoards] = useState([]);
    const [invitedBoards, setInvitedBoards] = useState([]);
    const [selectedBoardId, setSelectedBoardId] = useState(null);

    const token = localStorage.getItem("tokenLogin");

    const loadBoards = async () => {
        try {
            const res = await fetchBoards(token);
            setBoards(res.data);
        } catch {
            setBoards([]);
        }
    };

    const loadInvitedBoards = async () => {
        try {
            const res = await fetchInvitedBoards(token);
            setInvitedBoards(res.data);
        } catch {
            setInvitedBoards([]);
        }
    };

    const handleCreateBoard = async (data) => {
        try {
            await createBoard(data, token);
            toast.success("Board created!");
            await loadBoards();
        } catch (err) {
            console.error(err);
            toast.error("Failed to create board.");
        }
    };

    const handleEditBoard = async (boardId, updatedData) => {
        try {
            await editBoard(boardId, updatedData, token);
            toast.success("Board updated!");
            await loadBoards();
        } catch (err) {
            console.error(err);
            toast.error("Failed to edit board.");
        }
    };

    const handleDeleteBoard = async (boardId) => {
        try {
            await deleteBoard(boardId, token);
            toast.success("Board deleted!");
            await loadBoards();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete board.");
        }
    };

    useEffect(() => {
        if (token) {
            loadBoards();
            loadInvitedBoards();
        }
    }, [token]);

    return {
        boards,
        invitedBoards,
        selectedBoardId,
        setSelectedBoardId,
        handleCreateBoard,
        handleEditBoard,
        handleDeleteBoard,
    };
};

export default useBoards;
