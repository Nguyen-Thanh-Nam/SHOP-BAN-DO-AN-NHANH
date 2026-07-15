"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { OrderService } from "@/services/orderService";
import {
    ArrowLeft,
    Loader2,
    User,
    MapPin,
    Phone,
    CreditCard,
    Package,
    Clock,
    CheckCircle,
    Printer,
} from "lucide-react";
import { toast } from "react-toastify";

export default function OrderDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await OrderService.getOrderDetail(params.id);
                setOrder(res);
            } catch (error) {
                console.error("Lỗi:", error);
                toast.info("Không tìm thấy đơn hàng");
                router.push("/admin/orders");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [params.id, router]);

    const handleUpdateStatus = async (newStatus) => {
        if (!confirm(`Xác nhận chuyển trạng thái sang: ${newStatus}?`)) return;
        setUpdating(true);
        try {
            await OrderService.updateOrderStatus(order.id, newStatus);
            setOrder({ ...order, status: newStatus });
            toast.info("Cập nhật trạng thái thành công!");
        } catch (error) {
            toast.info("Lỗi cập nhật: " + error.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen text-[#f48120]">
                <Loader2 size={40} className="animate-spin" />
            </div>
        );

    if (!order) return null;

    return (
        <div className="min-h-screen bg-gray-100 px-6 py-8">
            <div className="max-w-8xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="group bg-white p-3 rounded-full shadow-sm border border-gray-200 hover:border-[#f48120] hover:text-[#f48120] transition-all"
                        >
                            <ArrowLeft
                                size={20}
                                className="text-gray-600 group-hover:text-[#f48120]"
                            />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                    Đơn hàng #{order.id}
                                </h1>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase border 
                                    ${
                                        order.status === "completed"
                                            ? "bg-green-100 text-green-700 border-green-200"
                                            : order.status === "cancelled"
                                            ? "bg-red-100 text-red-700 border-red-200"
                                            : "bg-yellow-100 text-yellow-700 border-yellow-200"
                                    }`}
                                >
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                <Clock size={14} /> Đặt ngày:{" "}
                                {new Date(order.created_at).toLocaleString(
                                    "vi-VN"
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-200/60">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-orange-100 p-2.5 rounded-xl">
                                    <Package
                                        size={22}
                                        className="text-[#f48120]"
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Chi tiết sản phẩm
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {order.items?.map((item, idx) => {
                                    let options = {};
                                    try {
                                        options =
                                            typeof item.options === "string"
                                                ? JSON.parse(item.options)
                                                : item.options;
                                    } catch (e) {}

                                    return (
                                        <div
                                            key={idx}
                                            className="py-4 flex gap-4"
                                        >
                                            <div className="w-20 h-20 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden relative shrink-0">
                                                <img
                                                    src={
                                                        item.product_image ||
                                                        "https://placehold.co/100"
                                                    }
                                                    alt={item.product_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-800">
                                                    {item.product_name}
                                                </h3>
                                                <div className="text-sm text-gray-500 mt-1 space-y-0.5">
                                                    {options &&
                                                        Object.entries(
                                                            options
                                                        ).map(
                                                            ([key, value]) => (
                                                                <div key={key}>
                                                                    <span className="font-medium text-gray-600">
                                                                        {key}:
                                                                    </span>{" "}
                                                                    {value}
                                                                </div>
                                                            )
                                                        )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium text-gray-900">
                                                    {parseInt(
                                                        item.unit_price
                                                    ).toLocaleString()}{" "}
                                                    đ
                                                    <span className="text-xs text-gray-500 ml-1">
                                                        x{item.quantity}
                                                    </span>
                                                </div>
                                                <div className="font-bold text-[#f48120] mt-1">
                                                    {parseInt(
                                                        item.total_price
                                                    ).toLocaleString()}{" "}
                                                    đ
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính</span>
                                    <span>
                                        {parseInt(
                                            order.subtotal
                                        ).toLocaleString()}{" "}
                                        đ
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển</span>
                                    <span>
                                        {parseInt(
                                            order.shipping_fee
                                        ).toLocaleString()}{" "}
                                        đ
                                    </span>
                                </div>
                                {order.discount_amount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>
                                            Giảm giá ({order.coupon_code})
                                        </span>
                                        <span>
                                            -
                                            {parseInt(
                                                order.discount_amount
                                            ).toLocaleString()}{" "}
                                            đ
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-100">
                                    <span>Tổng cộng</span>
                                    <span className="text-[#f48120]">
                                        {parseInt(order.total).toLocaleString()}{" "}
                                        đ
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-200/60">
                            <h3 className="font-bold text-gray-900 mb-4">
                                Cập nhật trạng thái
                            </h3>
                            <div className="space-y-3">
                                {order.status === "pending" && (
                                    <button
                                        onClick={() =>
                                            handleUpdateStatus("processing")
                                        }
                                        disabled={updating}
                                        className="w-full py-3 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition flex items-center justify-center gap-2"
                                    >
                                        {updating ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            "Xác nhận & Giao hàng"
                                        )}
                                    </button>
                                )}
                                {order.status === "processing" && (
                                    <button
                                        onClick={() =>
                                            handleUpdateStatus("completed")
                                        }
                                        disabled={updating}
                                        className="w-full py-3 bg-green-50 text-green-700 font-bold rounded-xl hover:bg-green-100 transition flex items-center justify-center gap-2"
                                    >
                                        {updating ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            <>
                                                <CheckCircle size={18} /> Hoàn
                                                thành đơn
                                            </>
                                        )}
                                    </button>
                                )}
                                {order.status !== "completed" &&
                                    order.status !== "cancelled" && (
                                        <button
                                            onClick={() =>
                                                handleUpdateStatus("cancelled")
                                            }
                                            disabled={updating}
                                            className="w-full py-3 border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition"
                                        >
                                            Hủy đơn hàng
                                        </button>
                                    )}
                                {order.status === "completed" && (
                                    <div className="text-center text-green-600 font-bold bg-green-50 py-3 rounded-xl">
                                        Đơn hàng đã hoàn thành
                                    </div>
                                )}
                                {order.status === "cancelled" && (
                                    <div className="text-center text-red-600 font-bold bg-red-50 py-3 rounded-xl">
                                        Đơn hàng đã bị hủy
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-200/60">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <User size={18} className="text-[#f48120]" />{" "}
                                Thông tin khách hàng
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase">
                                        Họ và tên
                                    </label>
                                    <p className="font-medium text-gray-800">
                                        {order.full_name}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1">
                                        <Phone size={12} /> Số điện thoại
                                    </label>
                                    <p className="font-medium text-gray-800">
                                        {order.phone_number}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1">
                                        <MapPin size={12} /> Địa chỉ giao hàng
                                    </label>
                                    <p className="font-medium text-gray-800">
                                        {order.address}
                                    </p>
                                </div>
                                {order.note && (
                                    <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                                        <label className="text-xs text-yellow-600 font-bold uppercase">
                                            Ghi chú từ khách
                                        </label>
                                        <p className="text-sm text-gray-700 mt-1 italic">
                                            "{order.note}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-200/60">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CreditCard
                                    size={18}
                                    className="text-[#f48120]"
                                />{" "}
                                Thanh toán
                            </h3>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                                <span className="text-sm text-gray-500 font-medium">
                                    Phương thức
                                </span>
                                <span className="font-bold text-gray-800 uppercase">
                                    {order.payment_method === "cod"
                                        ? "Tiền mặt (COD)"
                                        : order.payment_method}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
