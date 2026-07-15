import axiosClient from "./axiosClient";

export const BannerService = {
    getAll: async () => {
        const res = await axiosClient.get("/banners");
        return res.data;
    },
    create: async (formData) => {
        const res = await axiosClient.post("/banners", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },
    update: async (id, formData) => {
        const res = await axiosClient.put(`/banners/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },
    delete: async (id) => {
        return await axiosClient.delete(`/banners/${id}`);
    },
    getHomeBanners: async () => {
        const res = await axiosClient.get("/banners/home");
        return res.data;
    },
};
