import axiosClient from "./axiosClient";

export const DashboardService = {
    getStats: async () => {
        const res = await axiosClient.get("/dashboard/stats");
        return res.data;
    },
};
