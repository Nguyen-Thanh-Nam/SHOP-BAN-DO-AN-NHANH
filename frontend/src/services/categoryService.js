import axiosClient from "./axiosClient";

export const CategoryService = {
    getAll: async () => {
        const res = await axiosClient.get("/categories");
        return res.data;
    },

    create: async (formData) => {
        const res = await axiosClient.post("/categories", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    update: async (id, formData) => {
        const res = await axiosClient.put(`/categories/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    delete: async (id) => {
        return await axiosClient.delete(`/categories/${id}`);
    },
};
