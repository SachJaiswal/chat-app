import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client"


const baseURL = import.meta.env.MODE === "development" ? "http://localhost:5002" : "/";

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSignedUp: false,
    isLoggingIn: false,
    isSigningIn: false,
    isSigningOut: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");
            set({ authUser: response.data });
            get().connectSocket();
          
        } catch (error) {
            set({ authUser: null });
            console.log("Error in CheckAuth",error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signUp: async (data) => {
        set({ isSigningUp: true });
        try {
            const response = await axiosInstance.post("/auth/signup", data);
            set({ authUser: response.data });
            toast.success("Signup successful");
            get().connectSocket();
        } catch (error) {
            console.log("Error in SignUp",error);
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        try {
            const socket = get().socket;
            if (socket) {
                // Emit logout event before disconnecting
                socket.emit("logout");
            }
            await axiosInstance.post("/auth/logout");
            set({ 
                authUser: null,
                socket: null 
            });
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error(error.response?.data?.message || "Logout failed");
        }
    },

    login: async (data) => {
      set({ isLoggingIn: true });
      try {
        const res = await axiosInstance.post("/auth/login", data);
        set({ authUser: res.data });
        toast.success("Logged in successfully");
  
        get().connectSocket();
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isLoggingIn: false });
      }
    },
  
    updateProfile: async (data) => {
      set({ isUpdatingProfile: true });
      try {
        const res = await axiosInstance.put("/auth/update-profile", data);
        set({ authUser: res.data });
        toast.success("Profile updated successfully");
      } catch (error) {
        console.log("error in update profile:", error);
        toast.error(error.response?.data?.message || "Profile update failed");
      } finally {
        set({ isUpdatingProfile: false });
      }
    },
  
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(baseURL, {
            query: {
                userId: authUser._id,
            },
        });

        socket.connect();

        // Listen for online users updates
        socket.on("getOnlineUsers", (users) => {
            console.log("Received online users:", users);
            set({ onlineUsers: Array.isArray(users) ? users : [users] });
        });

        // Handle connection success
        socket.on("connect", () => {
            console.log("Socket connected successfully");
            // Emit setup event after connection
            socket.emit("setup", authUser._id);
        });

        set({ socket: socket });
    },
    disconnectSocket: () => {
      if (get().socket?.connected) get().socket.disconnect();
    },
  }));