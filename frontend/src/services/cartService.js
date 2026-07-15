import axiosClient from "./axiosClient";

export const CartService = {
    getCart: async () => {
        const res = await axiosClient.get("/cart");
        return res.data;
    },
    addToCart: async (item) => {
        return await axiosClient.post("/cart/add", item);
    },
    updateQuantity: async (cartId, quantity) => {
        return await axiosClient.put("/cart/update", { cartId, quantity });
    },
    removeItem: async (cartId) => {
        return await axiosClient.delete(`/cart/${cartId}`);
    },
};
