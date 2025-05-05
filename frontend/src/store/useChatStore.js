import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  users: [], // Initialize as empty array
  messages: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const { data } = await axiosInstance.get("/users");
      set({ users: data });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
      set({ users: [] }); // Reset to empty array on error
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const { data } = await axiosInstance.get(`/messages/${userId}`);
      // Transform the data to ensure consistent structure
      const transformedMessages = data.map(message => ({
        ...message,
        senderId: message.senderId?._id || message.senderId
      }));
      set({ messages: transformedMessages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser?._id) {
      toast.error("No user selected");
      return;
    }

    try {
      const { data } = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        {
          text: messageData.text || "",
          image: messageData.image || null
        }
      );
      
      // Transform the new message to match structure
      const newMessage = {
        ...data,
        senderId: data.senderId?._id || data.senderId
      };
      
      set({ messages: [...messages, newMessage] });
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Failed to send message");
    }
  },
  
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Remove existing listeners to prevent duplicates
    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      const { selectedUser, messages } = get();
      if (!selectedUser) return;

      // Check if the message belongs to current chat
      const isRelevantMessage =
        (newMessage.sender?._id === selectedUser._id && newMessage.receiver?._id === useAuthStore.getState().authUser?._id) ||
        (newMessage.receiver?._id === selectedUser._id && newMessage.sender?._id === useAuthStore.getState().authUser?._id);

      if (isRelevantMessage) {
        set({ messages: [...messages, newMessage] });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user, messages: [] });
  },

  clearMessages: () => set({ messages: [] })
}));