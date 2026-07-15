import axiosClient from "./axiosClient";

export const OrderService = {
    createOrder: async (data) => {
        const res = await axiosClient.post("/orders", data);
        return res.data;
    },
    getOrderDetail: async (id) => {
        const res = await axiosClient.get(`/orders/${id}`);
        return res.data;
    },
    getAllOrders: async () => {
        const res = await axiosClient.get("/orders");
        return res.data;
    },

    updateOrderStatus: async (id, status) => {
        const res = await axiosClient.put(`/orders/${id}/status`, { status });
        return res.data;
    },

    getOrdersByPhone: async (phone) => {
        const res = await axiosClient.get(`/orders/history/${phone}`);
        return res.data;
    },
};
