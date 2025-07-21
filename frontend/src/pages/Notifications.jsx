import React from "react";
import useNotifications from "../hooks/useNotification";

const Notifications = () => {
  const { invites, handleAction } = useNotifications();

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
              <div className="sm:flex block items-center text-right">
                <button
                  className="bg-green-500 text-white m-2 sm:px-2 px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => handleAction(invite, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white m-2 sm:px-2 px-4 py-2 rounded hover:bg-red-600"
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
