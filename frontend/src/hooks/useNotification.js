import { useEffect, useState } from "react";
import { fetchInvitations, respondToInvitation } from "../api/notificationsApi";
import { toast } from "react-toastify";

const useNotifications = () => {
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    const loadInvites = async () => {
      try {
        const res = await fetchInvitations();
        setInvites(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    loadInvites();
  }, []);

  const handleAction = async (invite, status) => {
    try {
      const res = await respondToInvitation({ ...invite, status });
      if (res.data?.success) {
        toast.success(`Invitation ${status === "accepted" ? "accepted" : "declined"}!`);
        setInvites((prev) => prev.filter((i) => i.invite_id !== invite.invite_id));
      } else {
        toast.error("Update failed!");
      }
    } catch (err) {
      toast.error("Connection error!");
      console.error("Failed to update invitation:", err);
    }
  };

  return { invites, handleAction };
};

export default useNotifications;
