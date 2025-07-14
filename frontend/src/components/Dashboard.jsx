import React, { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router";

const Dashboard = () => {
  const {
    boards = [],
    selectedBoardId,
    fetchBoards,
    onSelectBoard,
  } = useOutletContext() || {};
  const [selectedBoard, setSelectedBoard] = useState(null);
  useEffect(() => {
    if (selectedBoardId) {
      const token = localStorage.getItem("tokenLogin");
      axios.get(`http://localhost:4000/boards/${selectedBoardId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then(res => setSelectedBoard(res.data))
        .catch(() => setSelectedBoard(null));
    } else {
      setSelectedBoard(null);
    }
  }, [selectedBoardId]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 ml-8 flex flex-col pt-10 min-h-screen">
        <div className="flex-1 p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6">
          <h2 className="text-2xl font-bold mb-4">Your Boards</h2>
          {!selectedBoardId && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {boards.map((board) => (
                <div
                  key={board.id}
                  className="bg-white p-3 rounded-lg shadow-md transition-transform transform hover:-translate-y-1 hover:shadow-xl cursor-pointer border border-transparent hover:border-blue-400 group"
                  onClick={() => onSelectBoard(board.id)}
                >
                  <h3 className="font-bold text-lg text-blue-700 group-hover:text-blue-900 transition-colors mb-1 truncate">
                    {board.name}
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-800 transition-colors min-h-[32px]">
                    {board.description || <span className="italic text-gray-400">No description</span>}
                  </p>
                  <p className="text-gray-600 group-hover:text-gray-800 transition-colors min-h-[32px]">
                     <span className="italic text-gray-400">Members: No one</span>
                  </p>

                  <div
                    className="mt-4 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="px-5 py-2 text-base bg-blue-400 hover:bg-blue-600 text-white rounded-lg font-semibold"
                      onClick={() => handleEditBoard(board)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-5 py-2 text-base bg-red-400 hover:bg-red-500 text-white rounded-lg font-semibold"
                      onClick={() => handleDeleteBoard(board.id)}
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))}
            </div>

          )}
          {selectedBoardId && selectedBoard && (
            // <div className="w-full h-full bg-white rounded-xl shadow-lg p-6 mt-6"> 
            <div className="absolute top-20 left-64 right-0 bottom-0 bg-white p-6 overflow-auto">
              <button className="px-5 py-2 text-base bg-blue-400 hover:bg-blue-600 text-white rounded-lg font-semibold" onClick={() => onSelectBoard(null)}>&larr; Return Board List</button>
              <h3 className="font-bold text-2xl mb-2 pt-4 text-blue-700">{selectedBoard.name}</h3>
              <p className="text-gray-700 mb-2">{selectedBoard.description || <span className='italic text-gray-400'>No description</span>}</p>
              <div className="text-sm text-gray-400">ID: {selectedBoard.id}</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
// aaaa

export default Dashboard;