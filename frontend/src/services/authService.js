import axiosClient from "./axiosClient";

export const AuthService = {
    login: async (email, password) => {
        const response = await axiosClient.post("/auth/login", {
            email,
            password,
        });
        return response.data;
    },

    register: async (userData) => {
        const response = await axiosClient.post("/auth/register", userData);
        return response.data;
    },

    logout: async (refreshToken) => {
        return await axiosClient.post("/auth/logout", { refreshToken });
    },

    getProfile: async () => {
        const response = await axiosClient.get("/auth/profile");
        return response.data;
    },
    updateProfile: async (formData) => {
        const response = await axiosClient.put("/auth/profile", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
    changePassword: async (data) => {
        const res = await axiosClient.post("/auth/change-password", data);
        return res.data;
    },
    forgotPassword: async (email) => {
        return await axiosClient.post("/auth/forgot-password", { email });
    },

    resetPassword: async (data) => {
        return await axiosClient.post("/auth/reset-password", data);
    },
};
