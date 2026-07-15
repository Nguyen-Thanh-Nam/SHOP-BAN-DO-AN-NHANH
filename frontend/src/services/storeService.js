import axiosClient from "./axiosClient";

export const StoreService = {
    getAll: async () => {
        const res = await axiosClient.get("/stores");
        return res.data;
    },

    getDetail: async (id) => {
        const res = await axiosClient.get(`/stores/${id}`);
        return res.data;
    },

    create: async (data) => {
        const res = await axiosClient.post("/stores", data);
        return res.data;
    },

    update: async (id, data) => {
        const res = await axiosClient.put(`/stores/${id}`, data);
        return res.data;
    },

    delete: async (id) => {
        return await axiosClient.delete(`/stores/${id}`);
    },
};
