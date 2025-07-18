import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getProfile = async (token) => {
  const res = await axios.get(`${backendUrl}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getProfileByEmail = async (email, token) => {
  const res = await axios.get(`${backendUrl}/profile/${email}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


export const updateProfileName = async (token, name) => {
  const res = await axios.put(
    `${backendUrl}/profile`,
    { name },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const updateProfileAvatar = async (token, avatarFile) => {
  const formData = new FormData();
  formData.append("avatar", avatarFile);

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
  return res.data;
};
