import React from "react";

const InviteModal = ({
  setShowInvite,
  allUsers,
  board,
  alreadyInvited,
  inviteEmails,
  setInviteEmails,
  sendInvites,
}) => {
  const handleSendInvites = async () => {
    if (inviteEmails.length === 0) return;
    try {
      await sendInvites(inviteEmails);
      setShowInvite(false);
      setInviteEmails([]);
      alert("Đã gửi lời mời thành công!");
    } catch (err) {
      alert("Gửi lời mời thất bại!");
    }
  };

  const filteredUsers = allUsers.filter(
    (email) =>
      email !== board.userEmail && !alreadyInvited.includes(email)
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-20">
      <div className="bg-white p-6 rounded-lg shadow-lg w-75 sm:w-96 relative">
        <div
          className="absolute flex right-3 top-2 cursor-pointer"
          onClick={() => setShowInvite(false)}
        >
          <i className="fa-solid fa-xmark"></i>
        </div>
        <h2 className="text-xl font-bold mb-4 text-center">Invite Members</h2>
        <div className="mb-4">
          <div className="font-semibold mb-2">Select emails to invite:</div>
          <div className="max-h-40 overflow-y-auto border rounded p-2">
            {allUsers.length === 0 || filteredUsers.length === 0 ? (
              <div>No users available to invite.</div>
            ) : (
              filteredUsers.map((email) => (
                <label
                  key={email}
                  className="flex items-center gap-2 mb-1"
                >
                  <input
                    type="checkbox"
                    checked={inviteEmails.includes(email)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setInviteEmails([...inviteEmails, email]);
                      } else {
                        setInviteEmails(
                          inviteEmails.filter((em) => em !== email)
                        );
                      }
                    }}
                  />
                  <span>{email}</span>
                </label>
              ))
            )}
          </div>
        </div>
        <button
          onClick={handleSendInvites}
          className="bg-blue-500 text-white font-semibold cursor-pointer w-full py-2 rounded hover:bg-blue-600"
        >
          Send Invite
        </button>
      </div>
    </div>
  );
};

export default InviteModal;
