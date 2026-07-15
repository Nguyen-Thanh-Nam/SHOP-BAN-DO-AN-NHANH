import axiosClient from "./axiosClient";

export const ProductService = {
    getCategories: async () => {
        const res = await axiosClient.get("/categories");
        return res.data;
    },
    createCategory: async (formData) => {
        const res = await axiosClient.post("/categories", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },
    deleteCategory: async (id) => {
        return await axiosClient.delete(`/categories/${id}`);
    },

    getProducts: async (params) => {
        const res = await axiosClient.get("/products", { params });
        return res.data;
    },
    getProductDetail: async (id) => {
        const res = await axiosClient.get(`/products/${id}`);
        return res.data;
    },
    createProduct: async (formData) => {
        const res = await axiosClient.post("/products", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },
    updateProduct: async (id, formData) => {
        const res = await axiosClient.put(`/products/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },
    deleteProduct: async (id) => {
        return await axiosClient.delete(`/products/${id}`);
    },

    search: async (keyword) => {
        const res = await axiosClient.get(`/products/search`, {
            params: { keyword },
        });
        return res;
    },
};
