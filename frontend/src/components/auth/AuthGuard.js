"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children, allowedRoles = [] }) {
    const router = useRouter();
    const pathname = usePathname();

    const { user, isAuthenticated, isLoading } = useAuthStore();

    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkPermission = () => {
            const token = Cookies.get("accessToken");

            if (!token) {
                router.push("/?login=true");
                return;
            }

            if (isLoading || !user) {
                return;
            }

            if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                router.push("/");
                return;
            }

            setIsAuthorized(true);
        };

        checkPermission();
    }, [user, isLoading, isAuthenticated, router, allowedRoles]);

    if (isLoading || !user || !isAuthorized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-[#f48120]" size={48} />
            </div>
        );
    }

    return <>{children}</>;
}
