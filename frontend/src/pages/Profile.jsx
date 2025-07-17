import React, { useState } from "react";
import { useProfile } from "../hooks/useProfile";

const Profile = () => {
  const { user, loading, updateProfile } = useProfile();
  const [edit, setEdit] = useState(false);
  const [updateName, setUpdateName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [input, setInput] = useState(false);

  React.useEffect(() => {
    if (user) setUpdateName(user.name);
  }, [user]);

  const handleUpdate = async () => {
    await updateProfile({ name: updateName, avatar });
    setEdit(false);
  };

  return (
    <div>
      {user ? (
        <div className="flex flex-col items-center justify-center h-150 gap-4">
          {loading && (
            <div className="flex justify-center mt-5">
              <div className="loader border-t-4 border-blue-500 border-solid rounded-full h-10 w-10 animate-spin"></div>
            </div>
          )}
          <img
            className="inline-block size-40 rounded-full ring-4 ring-white shadow-md"
            src={
              user.picture ||
              "https://res.cloudinary.com/dwalye3nj/image/upload/v1752460385/user_doe5i4.jpg"
            }
            alt="User Avatar"
          />
          <div className="text-center">
            {edit ? (
              <div>
                <input
                  type="text"
                  value={updateName}
                  onChange={(e) => setUpdateName(e.target.value)}
                  placeholder="Update Name"
                  className="border border-gray-300 rounded-md p-2 mb-2"
                />
                <p
                  onClick={() => setInput(!input)}
                  className="italic text-blue-500 cursor-pointer"
                >
                  Change Avatar
                </p>
                {input && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0])}
                    className="border border-gray-300 rounded-md p-2 cursor-pointer mr-1 mb-2"
                  />
                )}
                <button
                  disabled={loading}
                  onClick={handleUpdate}
                  className={
                    loading
                      ? "px-4 py-2 mt-5 bg-blue-300 cursor-not-allowed text-white rounded-md font-bold"
                      : "px-4 py-2 mt-5 bg-blue-600 text-white rounded-md font-bold cursor-pointer hover:bg-blue-700 transition"
                  }
                >
                  {loading ? "Loading..." : "Save"}
                </button>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-500 italic">{user.email}</p>
                <button
                  onClick={() => setEdit(true)}
                  className="px-4 py-2 mt-5 bg-blue-600 text-white rounded-md font-bold cursor-pointer hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="loader border-t-4 border-blue-500 border-solid rounded-full h-10 w-10 animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Profile;
