import React, { useRef, useEffect, useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/bar/Sidebar";
import useBoards from "../hooks/useBoard";
import { FaBars, FaTimes } from "react-icons/fa";

const BoardPage = () => {
  const {
    boards,
    invitedBoards,
    selectedBoardId,
    setSelectedBoardId,
    handleCreateBoard,
    handleEditBoard,
    handleDeleteBoard,
    boardMembers,
    handleRemoveMember
  } = useBoards();
  const [editMembers, setEditMembers] = useState([]);
  const [removedInviteIds, setRemovedInviteIds] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newBoard, setNewBoard] = useState({ name: "", description: "" });
  const sidebarRef = useRef(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBoardData, setEditBoardData] = useState({ id: '', name: '', description: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBoardId, setDeleteBoardId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
   
    if (showEditModal && editBoardData.id && boardMembers[editBoardData.id]) {
      setEditMembers(boardMembers[editBoardData.id]);
      setRemovedInviteIds([]);
    }
    if (!showEditModal) {
      setEditMembers([]);
      setRemovedInviteIds([]);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen, showEditModal, editBoardData.id, boardMembers]);

  return (
    <>
      {/* Toggle Sidebar */}
      <div className="md:hidden fixed top-5 right-4 z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white p-2 text-2xl">
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <Sidebar
        ref={sidebarRef}
        boards={boards}
        invitedBoards={invitedBoards}
        fetchBoards={() => { }}
        onSelectBoard={setSelectedBoardId}
        selectedBoardId={selectedBoardId}
        handleEditBoard={handleEditBoard}
        handleDeleteBoard={handleDeleteBoard}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setShowCreate={setShowCreate}
      />

      <div className="md:ml-64 pt-20 transition-all duration-300">
        <Outlet context={{
          boards,
          invitedBoards,
          selectedBoardId,
          boardMembers,
          onSelectBoard: setSelectedBoardId,
          handleEditBoard,
          handleDeleteBoard,
          handleRemoveMember,
          showEditModal,
          setShowEditModal,
          editBoardData,
          setEditBoardData,
          showDeleteModal,
          setShowDeleteModal,
          deleteBoardId,
          setDeleteBoardId,
        }} />
      </div>

      {/* Modal Create Board */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <form
            className="bg-white p-6 rounded shadow-md w-72 sm:w-96 text-gray-800"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateBoard(newBoard);
              setShowCreate(false);
              setNewBoard({ name: "", description: "" });
            }}
          >
            <h2 className="text-xl font-bold mb-4">Create Board</h2>
            <input
              className="w-full mb-3 p-2 border rounded"
              placeholder="Board Name"
              value={newBoard.name}
              onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
              required
            />
            <textarea
              className="w-full mb-3 p-2 border rounded"
              placeholder="Board Description"
              value={newBoard.description}
              onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button type="button" className="px-4 py-2 bg-gray-300" onClick={() => setShowCreate(false)}>
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white">Create</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Edit Board */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <form
            className="bg-white p-6 rounded shadow-md w-96 text-gray-800"
            onSubmit={async (e) => {
              e.preventDefault();
              handleEditBoard(editBoardData.id, {
                name: editBoardData.name,
                description: editBoardData.description,
              });
              // Xóa các member đã bị loại khi bấm Save
              for (const inviteId of removedInviteIds) {
                await handleRemoveMember(editBoardData.id, { inviteId });
              }
              setShowEditModal(false);
              setEditBoardData({ id: '', name: '', description: '' });
            }}
          >
            <h2 className="text-xl font-bold mb-4">Edit Board</h2>
            <input
              className="w-full mb-3 p-2 border rounded"
              placeholder="Board Name"
              value={editBoardData.name}
              onChange={(e) =>
                setEditBoardData({ ...editBoardData, name: e.target.value })
              }
              required
            />
            <textarea
              className="w-full mb-3 p-2 border rounded"
              placeholder="Board Description"
              value={editBoardData.description}
              onChange={(e) =>
                setEditBoardData({ ...editBoardData, description: e.target.value })
              }
            />

            <p className="text-gray-600 group-hover:text-gray-800 transition-colors min-h-[32px]">
              {editMembers && editMembers.length > 0 ? (
                <span className="flex flex-wrap gap-2">
                  Members:
                  {editMembers.map((member, index) => (
                    <span
                      key={member.inviteId || member.id || index}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full"
                    >
                      {member.name}
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          setEditMembers(editMembers.filter(m => m.inviteId !== member.inviteId));
                          setRemovedInviteIds([...removedInviteIds, member.inviteId]);
                        }}
                        title="Remove member"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </span>
              ) : (
                <span className="italic text-gray-400">Members: No one</span>
              )}
            </p>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}


      {/* Modal Delete Board */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96 text-gray-800">
            <h2 className="text-xl font-bold mb-4">Delete Board</h2>
            <p className="mb-4">
              Bạn có chắc muốn xóa{" "}
              <span className="font-semibold text-red-500">
                {boards.find((b) => b.id === deleteBoardId)?.name}
              </span>{" "}
              không?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white"
                onClick={() => {
                  handleDeleteBoard(deleteBoardId);
                  setShowDeleteModal(false);
                  setDeleteBoardId(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default BoardPage;
