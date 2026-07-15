"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OrderService } from "@/services/orderService";
import {
    Loader2,
    Package,
    ChefHat,
    Truck,
    CheckCircle,
    XCircle,
    ArrowLeft,
    Calendar,
    ChevronRight,
    Search,
} from "lucide-react";
import { toast } from "react-toastify";

export default function TrackingPage() {
    const [phone, setPhone] = useState("");
    const [ordersList, setOrdersList] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!phone.trim()) return;

        setLoading(true);
        setError("");
        setOrdersList(null);
        setSelectedOrder(null);

        try {
            const res = await OrderService.getOrdersByPhone(phone.trim());
            if (res.data && res.data.length > 0) {
                setOrdersList(res.data);
            } else {
                setError("Không tìm thấy đơn hàng nào với số điện thoại này.");
            }
        } catch (err) {
            console.error(err);
            setError("Lỗi kết nối hoặc không tìm thấy thông tin.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = async (orderId) => {
        setLoading(true);
        try {
            const detail = await OrderService.getOrderDetail(orderId);
            setSelectedOrder(detail);
        } catch (err) {
            toast.info("Không tải được chi tiết đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const renderStatusBadge = (status) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-700",
            processing: "bg-blue-100 text-blue-700",
            shipping: "bg-purple-100 text-purple-700",
            completed: "bg-green-100 text-green-700",
            cancelled: "bg-red-100 text-red-700",
        };
        const labels = {
            pending: "Chờ xác nhận",
            processing: "Đang làm món",
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
                {labels[status]}
            </span>
        );
    };

    const getStepStatus = (status) => {
        switch (status) {
            case "pending":
                return 1;
            case "processing":
                return 2;
            case "shipping":
                return 3;
            case "completed":
                return 4;
            default:
                return 1;
        }
    };
    const STEPS = [
        { id: 1, label: "Đã đặt", icon: Package },
        { id: 2, label: "Đang làm", icon: ChefHat },
        { id: 3, label: "Đang giao", icon: Truck },
        { id: 4, label: "Hoàn thành", icon: CheckCircle },
    ];

    return (
        <div className=" bg-white font-sans pb-20">
            <div className="container mx-auto px-4 py-5 md:py-10">
                <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        Theo dõi đơn hàng
                    </h1>
                    <p className="text-gray-500 mb-8 text-base">
                        Nhập số điện thoại để kiểm tra tình trạng đơn hàng của
                        bạn ngay lập tức.
                    </p>

                    <div className="w-full max-w-lg mx-auto">
                        <form
                            onSubmit={handleSearch}
                            className="relative w-full"
                        >
                            <div className="relative flex items-center w-full border border-gray-300 rounded-full overflow-hidden shadow-sm focus-within:ring-4 focus-within:ring-[#f48120]/20 focus-within:border-[#f48120] transition-all bg-white hover:shadow-md">
                                <input
                                    type="text"
                                    placeholder="Nhập số điện thoại của bạn"
                                    className="w-full pl-6 pr-36 py-4 text-gray-700 outline-none text-xs md:text-base"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !phone}
                                    className="absolute right-1 top-1 bottom-1 bg-[#f48120] hover:bg-[#d96e17] text-white font-bold px-6 md:px-8 rounded-full transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {loading ? (
                                        <Loader2
                                            className="animate-spin"
                                            size={20}
                                        />
                                    ) : (
                                        "Kiểm tra"
                                    )}
                                </button>
                            </div>
                        </form>

                        {error && (
                            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
                                <XCircle size={18} /> {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl">
                {ordersList && !selectedOrder && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
                            <Search size={20} className="text-gray-800" />
                            <h2 className="font-bold text-gray-800 text-base">
                                Kết quả tìm kiếm ({ordersList.length} đơn)
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {ordersList.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleViewDetail(item.id)}
                                    className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-[#f48120] hover:shadow-md transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f48120] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-bold text-gray-800 text-base">
                                                    #{item.id}
                                                </span>
                                                {renderStatusBadge(item.status)}
                                            </div>
                                            <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                                <Calendar size={14} />{" "}
                                                {new Date(
                                                    item.created_at
                                                ).toLocaleString("vi-VN")}
                                            </p>
                                        </div>
                                        <div className="text-right flex items-center gap-4">
                                            <p className="font-bold text-[#f48120] text-xl">
                                                {parseInt(
                                                    item.total
                                                ).toLocaleString()}{" "}
                                                ₫
                                            </p>
                                            <ChevronRight
                                                size={20}
                                                className="text-gray-300 group-hover:text-[#f48120] transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedOrder && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-in zoom-in duration-300 mb-10">
                        <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex justify-between items-center">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="flex items-center gap-2 text-gray-500 hover:text-[#f48120] font-bold text-sm transition"
                            >
                                <ArrowLeft size={18} /> Quay lại
                            </button>
                            <span className="font-mono text-gray-400 text-xs">
                                ID: {selectedOrder.id}
                            </span>
                        </div>

                        <div className="p-6 md:p-8 bg-white">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Thông tin đơn hàng
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Đặt lúc:{" "}
                                        {new Date(
                                            selectedOrder.created_at
                                        ).toLocaleString("vi-VN")}
                                    </p>
                                </div>
                                {renderStatusBadge(selectedOrder.status)}
                            </div>

                            {selectedOrder.status !== "cancelled" && (
                                <div className="py-6 px-2">
                                    <div className="relative flex justify-between items-center w-full">
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-gray-100 rounded-full -z-0"></div>
                                        <div
                                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-[#f48120] rounded-full -z-0 transition-all duration-1000 ease-out"
                                            style={{
                                                width: `${
                                                    ((getStepStatus(
                                                        selectedOrder.status
                                                    ) -
                                                        1) /
                                                        3) *
                                                    100
                                                }%`,
                                            }}
                                        ></div>
                                        {STEPS.map((step) => {
                                            const active =
                                                getStepStatus(
                                                    selectedOrder.status
                                                ) >= step.id;
                                            const Icon = step.icon;
                                            return (
                                                <div
                                                    key={step.id}
                                                    className="relative z-10 flex flex-col items-center gap-3"
                                                >
                                                    <div
                                                        className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all ${
                                                            active
                                                                ? "bg-[#f48120] border-white text-white shadow-base scale-110"
                                                                : "bg-white border-gray-200 text-gray-300"
                                                        }`}
                                                    >
                                                        <Icon size={20} />
                                                    </div>
                                                    <span
                                                        className={`text-[10px] md:text-xs font-bold uppercase tracking-wide ${
                                                            active
                                                                ? "text-[#f48120]"
                                                                : "text-gray-400"
                                                        }`}
                                                    >
                                                        {step.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-gray-100 p-6 md:p-8 bg-gray-50/30">
                            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Package size={20} className="text-[#f48120]" />{" "}
                                Món ăn đã đặt
                            </h3>
                            <div className="space-y-4">
                                {selectedOrder.items?.map((item, idx) => {
                                    let opts = {};
                                    try {
                                        opts = JSON.parse(item.options);
                                    } catch (e) {}
                                    return (
                                        <div
                                            key={idx}
                                            className="flex justify-between items-start bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
                                        >
                                            <div className="flex gap-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded-base overflow-hidden shrink-0">
                                                    <img
                                                        src={
                                                            item.product_image ||
                                                            "https://placehold.co/100"
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">
                                                        {item.product_name}
                                                    </p>
                                                    {opts &&
                                                        Object.values(opts)
                                                            .length > 0 && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {Object.values(
                                                                    opts
                                                                ).join(", ")}
                                                            </p>
                                                        )}
                                                    <p className="text-sm font-bold text-[#f48120] mt-1">
                                                        x{item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-gray-700">
                                                {parseInt(
                                                    item.total_price
                                                ).toLocaleString()}
                                                đ
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
                                <span className="font-bold text-gray-600 text-base">
                                    Tổng thanh toán
                                </span>
                                <span className="text-3xl font-extrabold text-[#f48120]">
                                    {parseInt(
                                        selectedOrder.total
                                    ).toLocaleString()}
                                    đ
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
