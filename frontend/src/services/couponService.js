import axiosClient from "./axiosClient";

export const CouponService = {
    getAll: async () => {
        const res = await axiosClient.get("/coupons");
        return res.data;
    },
    checkCoupon: async (code, cartTotal) => {
        const res = await axiosClient.post("/coupons/check", {
            code,
            cartTotal,
        });

        return res.data;
    },

    getDetail: async (id) => {
        const res = await axiosClient.get("/coupons");
        return { data: res.data.data.find((c) => c.id == id) };
    },

    create: async (data) => {
        const res = await axiosClient.post("/coupons", data);
        return res.data;
    },

    update: async (id, data) => {
        const res = await axiosClient.put(`/coupons/${id}`, data);
        return res.data;
    },

    delete: async (id) => {
        return await axiosClient.delete(`/coupons/${id}`);
    },
};
