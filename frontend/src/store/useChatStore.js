import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

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
      set({ messages: data });
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
      
      set({ messages: [...messages, data] });
      return data;
    } catch (error) {
      console.error("Send message error:", error);
      const errorMessage = error.response?.data?.error || "Failed to send message";
      toast.error(errorMessage);
      throw error;
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user, messages: [] });
  },

  clearMessages: () => set({ messages: [] })
}));