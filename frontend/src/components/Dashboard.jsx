import React from "react";
import { useOutletContext } from "react-router";
import Card from "../pages/Card";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const {
    boards = [],
    invitedBoards = [],
    selectedBoardId,
    boardMembers = {},
    onSelectBoard,
    setShowEditModal,
    setEditBoardData,
    setShowDeleteModal,
    setDeleteBoardId,
  } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 ml-5 flex flex-col pt-10 min-h-screen">
        <div className="flex-1 p-5">
          <h2 className="text-2xl font-bold mb-4">Your Boards</h2>
          {/* Bdanh sach */}
          {!selectedBoardId && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {boards.map((board) => (
                  <div
                    key={board.id}
                    className="bg-white p-3 rounded-lg shadow-md transition-transform transform hover:-translate-y-1 hover:shadow-xl cursor-pointer border border-transparent hover:border-blue-400 group"
                    onClick={() => navigate(`/board/${board.id}`)}
                  >
                    <h3 className="font-bold text-lg text-blue-700 group-hover:text-blue-900 transition-colors mb-1 truncate">
                      {board.name}
                    </h3>
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors min-h-[32px]">
                      {board.description || <span className="italic text-gray-400">No description</span>}
                    </p>
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors min-h-[32px]">
                      {boardMembers[board.id] && boardMembers[board.id].length > 0 ? (
                        <span>
                          Members: {boardMembers[board.id].map(m => m.name).join(', ')}
                        </span>
                      ) : (
                        <span className="italic text-gray-400">Members: No one</span>
                      )}
                    </p>
                    <div
                      className="mt-4 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="px-5 py-2 text-base bg-blue-400 hover:bg-blue-600 text-white rounded-lg font-semibold"
                        onClick={() => {
                          setEditBoardData({
                            id: board.id,
                            name: board.name,
                            description: board.description || "",
                          });
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-5 py-2 text-base bg-red-400 hover:bg-red-500 text-white rounded-lg font-semibold"
                        onClick={() => {
                          setDeleteBoardId(board.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <h2 className="text-xl font-bold mb-4">Board Invitations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {invitedBoards.length > 0 ? (
                  invitedBoards.map((board) => (
                    <div
                      key={board.id}
                      className="bg-white p-3 rounded-lg shadow-md transition-transform transform hover:-translate-y-1 hover:shadow-xl cursor-pointer border border-transparent hover:border-green-400 group"
                      onClick={() => navigate(`/board/${board.id}`)}
                    >
                      <h3 className="font-bold text-lg text-green-700 group-hover:text-green-900 transition-colors mb-1 truncate">
                        {board.name}
                      </h3>
                      <p className="text-gray-600 group-hover:text-gray-800 transition-colors min-h-[32px]">
                        {board.description || <span className="italic text-gray-400">No description</span>}
                      </p>
                      <p className="text-gray-600 group-hover:text-gray-800 transition-colors min-h-[32px]">
                        <span className="italic text-gray-400">Status: Accepted</span>
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-blue-400 px-2 py-1">No invited boards</div>
                )}
              </div>
            </>
          )}

          {/* Board Detail */}
          {selectedBoardId && <Card />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
