import { useEffect, useState } from "react";
import { getProfile, updateProfileName, updateProfileAvatar } from "../api/profileApi";
import { toast } from "react-toastify";

export const useProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("tokenLogin");

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const data = await getProfile(token);
        setUser(data.user);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    fetchUser();
  }, [token]);

  const updateProfile = async ({ name, avatar }) => {
    if (!token) {
      toast.error("You need to be logged in to update your profile");
      return;
    }

    setLoading(true);
    try {
      let updated = false;

      if (name && name !== user.name) {
        await updateProfileName(token, name);
        setUser((prev) => ({ ...prev, name }));
        updated = true;
      }

      if (avatar) {
        const data = await updateProfileAvatar(token, avatar);
        setUser((prev) => ({ ...prev, picture: data.picture }));
        updated = true;
      }

      if (updated) {
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating profile", err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, setUser, updateProfile };
};
