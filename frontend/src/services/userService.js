import axiosClient from "./axiosClient";

export const UserService = {
    getAllUsers: async () => {
        const res = await axiosClient.get("/users");
        return res.data;
    },

    getUserDetail: async (id) => {
        const res = await axiosClient.get(`/users/${id}`);
        return res.data;
    },

    updateUser: async (id, data) => {
        const res = await axiosClient.put(`/users/${id}`, data);
        return res.data;
    },

    deleteUser: async (id) => {
        const res = await axiosClient.delete(`/users/${id}`);
        return res.data;
    },
};
