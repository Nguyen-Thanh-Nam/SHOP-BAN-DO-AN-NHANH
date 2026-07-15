"use client";

import { useEffect } from "react";
import useAuthStore from "@/stores/useAuthStore";
import useCartStore from "@/stores/useCartStore";
import Cookies from "js-cookie";

export default function AuthProvider({ children }) {
    const checkAuth = useAuthStore((state) => state.checkAuth);

    const fetchCartFromDB = useCartStore((state) => state.fetchCartFromDB);

    useEffect(() => {
        const initApp = async () => {
            const token = Cookies.get("accessToken");

            if (token) {
                await checkAuth();

                const user = useAuthStore.getState().user;

                if (user) {
                    await fetchCartFromDB();
                }
            }
        };

        initApp();
    }, [checkAuth, fetchCartFromDB]);

    return <>{children}</>;
}
