import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Profile = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [updateName, setUpdateName] = useState("");
  const [input, setInput] = useState(false);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("tokenLogin");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${backendUrl}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200) {
          setUser(res.data.user);
          setUpdateName(res.data.user.name);
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

const handleUpdate = async () => {
  const token = localStorage.getItem("tokenLogin");
  if (!token) {
    toast.error("You need to be logged in to update your profile");
    return;
  }

  let updated = false;

  try {
    // Cập nhật tên
    if (updateName !== user.name) {
      const res = await axios.put(
        `${backendUrl}/profile`,
        { name: updateName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        setUser((prev) => ({ ...prev, name: updateName }));
        updated = true;
      }
    }

    // Cập nhật avatar
    if (avatar) {
      const formData = new FormData();
      formData.append("avatar", avatar);

      const res = await axios.put(
        `${backendUrl}/profile/update-avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        setUser((prev) => ({ ...prev, picture: res.data.picture }));
        updated = true;
      }
    }

    if (updated) {
      toast.success("Profile updated successfully!");
      setEdit(false);
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    toast.error("Failed to update profile");
  }
};


  return (
    <div>
      {user ? (
        <div className="flex flex-col items-center justify-center h-150 gap-4">
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
                  onClick={handleUpdate}
                  className="px-4 py-2 mt-5 bg-blue-600 text-white rounded-md font-bold cursor-pointer hover:bg-blue-700 transition"
                >
                  Save
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
