"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    List,
    LogOut,
    Package,
    Users,
    Ticket,
    Store,
    Image as ImageIcon,
} from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";
import AuthGuard from "@/components/auth/AuthGuard";

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    const menuItems = [
        {
            name: "Tổng quan",
            href: "/admin",
            icon: <LayoutDashboard size={20} />,
            roles: ["admin", "staff"],
        },
        {
            name: "Đơn hàng",
            href: "/admin/orders",
            icon: <ShoppingBag size={20} />,
            roles: ["admin", "staff"],
        },
        {
            name: "Sản phẩm",
            href: "/admin/products",
            icon: <Package size={20} />,
            roles: ["admin"],
        },
        {
            name: "Danh mục",
            href: "/admin/categories",
            icon: <List size={20} />,
            roles: ["admin"],
        },
        {
            name: "Mã giảm giá",
            href: "/admin/coupons",
            icon: <Ticket size={20} />,
            roles: ["admin"],
        },
        {
            name: "Cửa hàng",
            href: "/admin/stores",
            icon: <Store size={20} />,
            roles: ["admin"],
        },
        {
            name: "Banners",
            href: "/admin/banners",
            icon: <ImageIcon size={20} />,
            roles: ["admin"],
        },
        {
            name: "Người dùng",
            href: "/admin/users",
            icon: <Users size={20} />,
            roles: ["admin"],
        },
    ];

    return (
        <AuthGuard allowedRoles={["admin", "staff"]}>
            <div className="flex h-screen bg-gray-50/50">
                <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed inset-y-0 left-0 z-50">
                    <div className="h-20 flex items-center px-8 border-b border-gray-100">
                        <Link
                            href="/"
                            className="flex items-center gap-2 group"
                        >
                            <div className="w-20 h-8 bg-[#f48120] rounded-lg flex items-center justify-center text-white font-black text-xl group-hover:rotate-12 transition-transform">
                                CRISPC
                            </div>
                            <span className="text-2xl font-black text-gray-800 tracking-tighter">
                                Admin<span className="text-[#f48120]">.</span>
                            </span>
                        </Link>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                        <p className="px-4 text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">
                            Quản lý
                        </p>

                        {menuItems.map((item) => {
                            if (user && !item.roles.includes(user.role))
                                return null;

                            const isActive =
                                pathname === item.href ||
                                (item.href !== "/admin" &&
                                    pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-1 group relative overflow-hidden ${
                                        isActive
                                            ? "bg-[#f48120] text-white shadow-md shadow-orange-200"
                                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                                >
                                    <span
                                        className={`${
                                            isActive
                                                ? "text-white"
                                                : "group-hover:text-[#f48120] transition-colors"
                                        }`}
                                    >
                                        {item.icon}
                                    </span>

                                    <span className="relative z-10">
                                        {item.name}
                                    </span>

                                    {isActive && (
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-[#f48120] border-2 border-white shadow-sm">
                                {user?.full_name?.[0]?.toUpperCase() || "A"}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-gray-900 truncate">
                                    {user?.full_name}
                                </p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                                    {user?.role === "admin"
                                        ? "Quản trị viên"
                                        : "Nhân viên"}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                logout();
                                window.location.href = "/";
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl w-full transition font-bold text-sm border border-gray-100 shadow-sm hover:border-red-100"
                        >
                            <LogOut size={18} /> Đăng xuất
                        </button>
                    </div>
                </aside>

                <main className="flex-1 md:ml-64 min-h-screen flex flex-col">{children}</main>
            </div>
        </AuthGuard>
    );
}
