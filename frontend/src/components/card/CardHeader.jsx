import React from "react";
import { FaPlus } from "react-icons/fa";
import InviteModal from "./InviteModal";
import { useNavigate } from "react-router-dom";

const CardHeader = ({
  board,
  boardId,
  showInvite,
  setShowInvite,
  allUsers,
  alreadyInvited,
  inviteEmails,
  setInviteEmails,
  sendInvites,
  boardMembers,
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between mb-2">
      <div>
        <h3 className="font-bold py-2 text-lg md:text-2xl text-blue-700 capitalize">
          {board.name}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="text-gray-600 italic">{board.description}</div>
        </div>
        {showInvite && (
          <InviteModal
            setShowInvite={setShowInvite}
            allUsers={allUsers}
            board={board}
            alreadyInvited={alreadyInvited}
            inviteEmails={inviteEmails}
            setInviteEmails={setInviteEmails}
            sendInvites={sendInvites}
          />
        )}
      </div>
      <div className="flex -space-x-2 items-center">
        <button
          className="w-10 md:w-16 flex-shrink-0 gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow p-2 flex items-center justify-center cursor-pointer"
          onClick={() => setShowInvite(true)}
        >
          <FaPlus />
        </button>

        {boardMembers[boardId] &&
          boardMembers[boardId].length > 0 &&
          boardMembers[boardId].map((m, idx) => (
            <img
              key={m.email || idx}
              className="inline-block size-8 md:size-10 rounded-full ring-2 ring-white cursor-pointer"
              src={m.picture || "https://ui-avatars.com/api/?name=" + m.name}
              alt={m.name || m.email}
              onClick={() => navigate(`/profile/${m.email}`)}
              title={`View ${m.name || m.email}'s profile`}
            />
          ))}
      </div>
    </div>
  );
};

export default CardHeader;
