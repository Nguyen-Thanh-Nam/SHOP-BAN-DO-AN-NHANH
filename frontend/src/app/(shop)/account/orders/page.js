"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    LogOut,
    Package,
    Calendar,
    ChevronRight,
    Search,
    Loader2,
    Filter,
    User,
    Ticket,
    ShoppingBag,
    MapPin,
} from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";
import { OrderService } from "@/services/orderService";

const StatusBadge = ({ status }) => {
    const styles = {
        pending: "bg-yellow-100 text-yellow-700",
        processing: "bg-blue-100 text-blue-700",
        shipping: "bg-purple-100 text-purple-700",
        completed: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
    };
    const labels = {
        pending: "Chờ xác nhận",
        processing: "Đang chuẩn bị",
        shipping: "Đang giao",
        completed: "Hoàn thành",
        cancelled: "Đã hủy",
    };
    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
                styles[status] || styles.pending
            }`}
        >
            {labels[status] || status}
        </span>
    );
};

const OrderHistoryPage = () => {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            try {
                const res = await OrderService.getOrdersByPhone(user.phone);
                setOrders(res.data || []);
            } catch (error) {
                console.error("Lỗi tải đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    const filteredOrders = orders.filter((order) => {
        if (filterStatus === "all") return true;
        return order.status === filterStatus;
    });

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            <div className="container mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-3/4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h1 className="text-xl font-bold flex items-center gap-2 text-[#f48120]">
                                <Package className="text-[#f48120]" /> Lịch sử
                                đơn hàng
                            </h1>

                            <div className="relative">
                                <select
                                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-base focus:outline-none focus:border-[#f48120] text-sm font-medium cursor-pointer"
                                    value={filterStatus}
                                    onChange={(e) =>
                                        setFilterStatus(e.target.value)
                                    }
                                >
                                    <option value="all">Tất cả đơn hàng</option>
                                    <option value="pending">
                                        Chờ xác nhận
                                    </option>
                                    <option value="processing">
                                        Đang chuẩn bị
                                    </option>
                                    <option value="shipping">Đang giao</option>
                                    <option value="completed">
                                        Hoàn thành
                                    </option>
                                    <option value="cancelled">Đã hủy</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                    <Filter size={16} />
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2
                                    className="animate-spin text-[#f48120]"
                                    size={40}
                                />
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                                <Package
                                    size={64}
                                    className="mx-auto text-gray-300 mb-4"
                                />
                                <p className="text-gray-500 font-medium">
                                    Chưa có đơn hàng nào.
                                </p>
                                <Link
                                    href="/menu"
                                    className="mt-4 inline-block text-[#f48120] font-bold hover:underline"
                                >
                                    Đặt món ngay
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-orange-200 transition bg-white group cursor-pointer"
                                        onClick={() =>
                                            router.push(
                                                `/tracking?code=${order.id}`
                                            )
                                        }
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-bold text-gray-800 text-sm">
                                                        #{order.id}
                                                    </span>
                                                    <StatusBadge
                                                        status={order.status}
                                                    />
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center gap-1.5">
                                                    <Calendar size={14} />
                                                    {new Date(
                                                        order.created_at
                                                    ).toLocaleString("vi-VN")}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-xs text-gray-600 font-medium uppercase mb-1">
                                                    Tổng tiền
                                                </span>
                                                <span className="text-base font-bold text-gray-600">
                                                    {parseInt(
                                                        order.total
                                                    ).toLocaleString()}{" "}
                                                    ₫
                                                </span>
                                            </div>
                                        </div>

                                        <div className="h-px bg-gray-100 my-4"></div>

                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-gray-600">
                                                <span className="line-clamp-1">
                                                    {order.items
                                                        ? `${order.items.length} món ăn`
                                                        : "Xem chi tiết để biết thêm"}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm font-bold text-gray-600 group-hover:underline">
                                                Xem chi tiết{" "}
                                                <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
                                className="py-4 px-4 bg-orange-50 border-l-4 border-[#f48120] text-sm font-bold text-[#f48120] transition flex items-center gap-3"
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

export default OrderHistoryPage;
