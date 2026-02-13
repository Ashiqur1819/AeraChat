import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const { socket, axios, authUser } = useContext(AuthContext);

  // Get all users
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {});
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Get all messages
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Send message
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData,
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Subscribe message
  const subscribeToMessages = useCallback(() => {
    if (!socket) return;

    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      const myId = String(authUser?._id || "");
      const senderId = String(newMessage.senderId || "");
      const selectedId = selectedUser?._id ? String(selectedUser._id) : null;

      if (senderId === myId) return;

      if (selectedId && senderId === selectedId) {
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`).catch(() => {});
      } else {
        setUnseenMessages((prev) => {
          const sId = senderId;
          const currentCount = prev && prev[sId] ? Number(prev[sId]) : 0;
          return {
            ...prev,
            [sId]: currentCount + 1,
          };
        });
      }
    });
  }, [socket, selectedUser, authUser, axios]);

  useEffect(() => {
    subscribeToMessages();
    return () => socket?.off("newMessage");
  }, [subscribeToMessages, socket]);

  useEffect(() => {
    if (selectedUser) {
      setUnseenMessages((prev) => ({
        ...prev,
        [selectedUser._id]: 0,
      }));
    }
  }, [selectedUser]);

  const value = {
    messages,
    setMessages,
    users,
    selectedUser,
    setSelectedUser,
    getUsers,
    sendMessage,
    getMessages,
    unseenMessages,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
