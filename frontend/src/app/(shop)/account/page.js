"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    LogOut,
    ChevronLeft,
    User,
    MapPin,
    ShoppingBag,
    Ticket,
} from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";

const AccountPage = () => {
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    const getAvatarSrc = () => {
        if (!user?.avatar) {
            return "https://popeyes.vn/assets/img/rewards/reward.svg";
        }

        if (user.avatar.startsWith("/uploads")) {
            const apiUrl =
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
            const baseUrl = apiUrl.replace("/api", "");
            return `${baseUrl}${user.avatar}`;
        }

        return user.avatar;
    };

    if (!user) return null;

    return (
        <div className="bg-white font-sans">
            <div className="container mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-3/4 flex flex-col items-center justify-center min-h-[400px]">
                        <div className="relative w-28 h-28 mb-4">
                            <div className="w-full h-full rounded-full bg-[#f48120] flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                                <img
                                    src={getAvatarSrc()}
                                    alt="Avatar"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                            {user.full_name || "Khách hàng"}
                        </h2>

                        <p className="text-blue-700 font-bold text-sm">
                            {user.role === "admin"
                                ? "Quản trị viên"
                                : "Thành viên mới"}
                        </p>
                    </div>

                    <div className="w-full md:w-1/4 border-l border-gray-100 md:pl-0">
                        <div className="flex flex-col sticky top-24 bg-white rounded-xl">
                            <Link
                                href="/account/profile"
                                className="py-4 px-4 border-b border-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-3"
                            >
                                <User size={18} /> Thông tin tài khoản
                            </Link>

                            <Link
                                href="/account/vouchers"
                                className="py-4 px-4 border-b border-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-3"
                            >
                                <Ticket size={18} /> Ưu đãi của tôi
                            </Link>

                            <Link
                                href="/account/orders"
                                className="py-4 px-4 border-b border-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-3"
                            >
                                <ShoppingBag size={18} /> Lịch sử đơn hàng
                            </Link>

                            <Link
                                href="/account/address"
                                className="py-4 px-4 border-b border-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-3"
                            >
                                <MapPin size={18} /> Địa chỉ giao hàng
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="py-4 px-4 border-b border-gray-100 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition flex items-center gap-3 w-full text-left"
                            >
                                <LogOut size={18} /> Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
