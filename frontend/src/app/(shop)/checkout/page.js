"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    Loader2,
    MapPin,
    Phone,
    User,
    FileText,
    Wallet,
    QrCode,
} from "lucide-react";
import useCartStore from "@/stores/useCartStore";
import useAuthStore from "@/stores/useAuthStore";
import { OrderService } from "@/services/orderService";
import SearchBar from "@/components/shared/SearchBar";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const CheckoutPage = () => {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    const { items, clearCart, appliedCoupon } = useCartStore();
    const { user } = useAuthStore();

    const subTotal = items.reduce(
        (total, item) => total + item.unitPrice * item.quantity,
        0
    );
    const shippingFee = 20000;
    const discountAmount = appliedCoupon
        ? appliedCoupon.calculated_discount
        : 0;
    const finalTotal = subTotal + shippingFee - discountAmount;

    const [formData, setFormData] = useState({
        full_name: "",
        phone_number: "",
        address: "",
        note: "",
        payment_method: "cod",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => setIsMounted(true), []);

    useEffect(() => {
        if (isMounted) {
            const savedAddress = Cookies.get("delivery_address");

            setFormData((prev) => ({
                ...prev,
                full_name: user?.full_name || "",
                phone_number: user?.phone || "",
                address: savedAddress || "",
            }));
        }
    }, [isMounted, user]);

    useEffect(() => {
        if (isMounted && items.length === 0) {
            router.push("/menu");
        }
    }, [isMounted]);

    if (!isMounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-[#f48120]" size={40} />
            </div>
        );
    }

    if (items.length === 0) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.full_name || !formData.phone_number) {
            toast.info("Vui lòng điền tên và số điện thoại");
            return;
        }
        const latestAddress = Cookies.get("delivery_address");

        if (!latestAddress) {
            toast.info(
                "Chưa có địa chỉ giao hàng. Vui lòng chọn địa chỉ ở trang chủ hoặc menu."
            );
            return;
        }

        setLoading(true);
        try {
            const orderPayload = {
                ...formData,
                address: latestAddress,
                subtotal: subTotal,
                shipping_fee: shippingFee,
                discount_amount: discountAmount,
                coupon_code: appliedCoupon ? appliedCoupon.code : null,
                total: finalTotal,
                items: items.map((item) => ({
                    id: item.id,
                    title: item.title,
                    image: item.image,
                    unitPrice: item.unitPrice,
                    quantity: item.quantity,
                    selectedOptions: item.selectedOptions,
                })),
            };

            const res = await OrderService.createOrder(orderPayload);
            clearCart();

            if (formData.payment_method === "qrcode") {
                router.push(`/payment/${res.order_id}`);
            } else {
                toast.info(`Đặt hàng thành công! Mã đơn: #${res.order_id}`);
                router.push("/");
            }
        } catch (error) {
            console.error(error);
            toast.info(
                "Lỗi đặt hàng: " +
                    (error.response?.data?.message || "Lỗi hệ thống")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 font-sans">
            <div className="container mx-auto px-4 max-w-5xl">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Xác nhận đơn hàng
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-[#f48120] font-bold text-lg mb-4 flex items-center gap-2">
                            Thông tin giao hàng
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">
                                    Họ và tên{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User
                                        size={18}
                                        className="absolute left-3 top-3 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        placeholder="Nhập họ và tên"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-[#f48120] outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">
                                    Số điện thoại{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone
                                        size={18}
                                        className="absolute left-3 top-3 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        placeholder="Nhập số điện thoại"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-[#f48120] outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">
                                    Địa chỉ nhận hàng{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <SearchBar></SearchBar>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                        <h2 className="text-[#f48120] font-bold text-lg mb-4">
                            Thông tin đơn hàng
                        </h2>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">
                                Ghi chú
                            </label>
                            <div className="relative">
                                <FileText
                                    size={18}
                                    className="absolute left-3 top-3 text-gray-400"
                                />
                                <textarea
                                    name="note"
                                    value={formData.note}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Ví dụ: Không cay, giao giờ hành chính..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-[#f48120] outline-none resize-none"
                                ></textarea>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 text-sm space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Tạm tính ({items.length} món)</span>
                                <span className="font-bold">
                                    {subTotal.toLocaleString()} ₫
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Phí giao hàng</span>
                                <span className="font-bold">
                                    {shippingFee.toLocaleString()} ₫
                                </span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-[#f48120]">
                                    <span>Voucher ({appliedCoupon.code})</span>
                                    <span className="font-bold">
                                        -{discountAmount.toLocaleString()} ₫
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-xl font-bold text-[#f48120] mt-4 pt-4 border-t border-dashed border-gray-200">
                                <span>Thành tiền</span>
                                <span>{finalTotal.toLocaleString()} ₫</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-[#f48120] font-bold text-lg mb-4">
                        Phương thức thanh toán
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                                formData.payment_method === "cod"
                                    ? "border-[#f48120] bg-orange-50"
                                    : "border-gray-100"
                            }`}
                        >
                            <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    formData.payment_method === "cod"
                                        ? "border-[#f48120]"
                                        : "border-gray-300"
                                }`}
                            >
                                {formData.payment_method === "cod" && (
                                    <div className="w-2.5 h-2.5 bg-[#f48120] rounded-full" />
                                )}
                            </div>
                            <input
                                type="radio"
                                name="payment_method"
                                value="cod"
                                className="hidden"
                                checked={formData.payment_method === "cod"}
                                onChange={handleChange}
                            />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                    <Wallet size={20} />
                                </div>
                                <span className="font-bold text-gray-700">
                                    Tiền mặt (COD)
                                </span>
                            </div>
                        </label>
                        <label
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                                formData.payment_method === "qrcode"
                                    ? "border-[#f48120] bg-orange-50"
                                    : "border-gray-100"
                            }`}
                        >
                            <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    formData.payment_method === "qrcode"
                                        ? "border-[#f48120]"
                                        : "border-gray-300"
                                }`}
                            >
                                {formData.payment_method === "qrcode" && (
                                    <div className="w-2.5 h-2.5 bg-[#f48120] rounded-full" />
                                )}
                            </div>
                            <input
                                type="radio"
                                name="payment_method"
                                value="qrcode"
                                className="hidden"
                                checked={formData.payment_method === "qrcode"}
                                onChange={handleChange}
                            />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                    <QrCode size={20} />
                                </div>
                                <span className="font-bold text-gray-700">
                                    QRCode
                                </span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-[#f48120] hover:bg-[#d96e17] text-white font-bold text-lg py-3 px-12 rounded-full shadow-lg shadow-orange-200 transition-all flex items-center gap-2 transform hover:scale-105"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" /> Đang xử
                                lý...
                            </>
                        ) : (
                            "Hoàn tất đơn hàng"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
