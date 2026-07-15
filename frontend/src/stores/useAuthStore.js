import { create } from "zustand";
import Cookies from "js-cookie";
import { AuthService } from "@/services/authService";

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const res = await AuthService.login(email, password);
            const { user, tokens } = res.data;

            Cookies.set("accessToken", tokens.accessToken);
            Cookies.set("refreshToken", tokens.refreshToken);

            set({ user, isAuthenticated: true, isLoading: false });

            return { success: true, error: null };
        } catch (err) {
            set({ isLoading: false });
            return {
                success: false,
                error: err.response?.data?.message || "Đăng nhập thất bại",
            };
        }
    },

    register: async (registerData) => {
        set({ isLoading: true });
        try {
            await AuthService.register(registerData);
            set({ isLoading: false });
            return { success: true, error: null };
        } catch (err) {
            set({ isLoading: false });
            return {
                success: false,
                error: err.response?.data?.message || "Đăng ký thất bại",
            };
        }
    },

    logout: async () => {
        try {
            const refreshToken = Cookies.get("refreshToken");
            if (refreshToken) await AuthService.logout(refreshToken);
        } catch (err) {
            console.error(err);
        } finally {
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            set({ user: null, isAuthenticated: false });
        }
    },

    checkAuth: async () => {
        const token = Cookies.get("accessToken");
        if (!token) {
            set({ isAuthenticated: false, user: null });
            return;
        }

        set({ isLoading: true });
        try {
            const res = await AuthService.getProfile();
            set({ user: res.data, isAuthenticated: true, isLoading: false });
        } catch (err) {
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },

    updateProfile: async (updateData) => {
        set({ isLoading: true });
        try {
            const res = await AuthService.updateProfile(updateData);

            set({ user: res.data, isLoading: false });

            return { success: true };
        } catch (err) {
            set({ isLoading: false });
            return {
                success: false,
                error: err.response?.data?.message || "Cập nhật thất bại",
            };
        }
    },
}));

export default useAuthStore;
