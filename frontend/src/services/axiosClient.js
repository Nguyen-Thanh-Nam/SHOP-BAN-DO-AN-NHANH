import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            (error.response?.status === 403 ||
                error.response?.status === 401) &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                const refreshToken = Cookies.get("refreshToken");
                if (!refreshToken) throw new Error("No refresh token");

                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
                    {
                        refreshToken,
                    }
                );

                const { accessToken, refreshToken: newRefreshToken } =
                    res.data.tokens;
                Cookies.set("accessToken", accessToken);
                Cookies.set("refreshToken", newRefreshToken);

                originalRequest.headers[
                    "Authorization"
                ] = `Bearer ${accessToken}`;
                return axiosClient(originalRequest);
            } catch (refreshError) {
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
