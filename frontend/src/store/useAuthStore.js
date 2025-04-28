import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSignedUp: false,
    isLoggingIng: false,
    isSigningIn: false,
    isSigningOut: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");
            set({ authUser: response.data });
        } catch (error) {
            set({ authUser: null });
            console.log("Error in CheckAuth",error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signUp: async (data) => {
        try {
            const response = await axiosInstance.post("/auth/signup", data);
            set({ authUser: response.data });
        } catch (error) {
            console.log("Error in SignUp",error);
        }
    }
})
);