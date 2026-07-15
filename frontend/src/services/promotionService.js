import axiosClient from "./axiosClient";

export const PromotionService = {
    getAll: async (params) => {
        const res = await axiosClient.get("/promotions", { params });
        return res.data;
    },
    getDetail: async (slug) => {
        const res = await axiosClient.get(`/promotions/${slug}`);
        return res.data;
    },
    create: async (formData) => {
        const res = await axiosClient.post("/promotions", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },
    update: async (id, formData) => {
        const res = await axiosClient.put(`/promotions/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },
    delete: async (id) => {
        return await axiosClient.delete(`/promotions/${id}`);
    },
};
