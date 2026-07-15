import axiosClient from "./axiosClient";

export const AddressService = {
    getList: async () => {
        const response = await axiosClient.get("/addresses");
        return response.data;
    },

    create: async (data) => {
        const response = await axiosClient.post("/addresses", data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await axiosClient.put(`/addresses/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await axiosClient.delete(`/addresses/${id}`);
        return response.data;
    },

    setDefault: async (id) => {
        const response = await axiosClient.put(`/addresses/${id}/set-default`);
        return response.data;
    },
};
