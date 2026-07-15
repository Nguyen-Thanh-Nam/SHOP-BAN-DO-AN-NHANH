"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ArrowLeft, Ticket } from "lucide-react";
import useCartStore from "@/stores/useCartStore";
import { CouponService } from "@/services/couponService";
import { toast } from "react-toastify";

const CartPage = () => {
    const {
        items,
        updateQuantity,
        removeFromCart,
        getTotalPrice,
        appliedCoupon,
        applyCoupon,
    } = useCartStore();

    const [voucherCode, setVoucherCode] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [voucherError, setVoucherError] = useState("");

    const getImageUrl = (path) => {
        if (!path) return "https://placehold.co/400x400?text=No+Image";
        if (path.startsWith("http")) return path;
        return `${
            process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
            "http://localhost:4000"
        }${path}`;
    };

    const subTotal = items.reduce(
        (total, item) => total + item.unitPrice * item.quantity,
        0
    );
    const shippingFee = 20000;

    const discountAmount = appliedCoupon
        ? appliedCoupon.calculated_discount
        : 0;
    const finalTotal = subTotal + shippingFee - discountAmount;

    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) return;
        setIsChecking(true);
        setVoucherError("");

        try {
            const res = await CouponService.checkCoupon(voucherCode, subTotal);

            applyCoupon(res.data);

            toast.info(`Áp dụng mã ${res.data.code} thành công!`);
        } catch (error) {
            const msg =
                error.response?.data?.message || "Mã giảm giá không hợp lệ";
            setVoucherError(msg);
        } finally {
            setIsChecking(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className=" flex flex-col items-center justify-center p-4">
                <img
                    src="/images/tracking-chicken-run.png"
                    alt="chicken"
                    className="w-80"
                />
                <h2 className="text-xl font-bold text-gray-800">
                    Giỏ hàng đang trống
                </h2>
                <Link
                    href="/menu"
                    className="mt-6 bg-[#f48120] text-white px-8 py-3 rounded-full font-bold hover:bg-[#d96e17] transition shadow-lg shadow-orange-200"
                >
                    Đến Thực Đơn
                </Link>
            </div>
        );
    }

    return (
        <div className=" bg-white py-8">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link
                        href="/menu"
                        className="md:hidden p-2 bg-white rounded-full shadow-sm text-gray-600"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Giỏ hàng của bạn:
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3 space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.cartId}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 relative group"
                            >
                                <div className="relative w-24 h-24 flex-shrink-0 bg-[#FFF8F3] rounded-lg overflow-hidden">
                                    <Image
                                        src={getImageUrl(item.image)}
                                        alt={item.title}
                                        fill
                                        className="object-contain p-1"
                                        unoptimized={true}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 text-base md:text-lg leading-tight mb-1 line-clamp-2">
                                        {item.title}
                                    </h3>

                                    {item.selectedOptions &&
                                        Object.keys(item.selectedOptions)
                                            .length > 0 && (
                                            <div className="text-xs md:text-sm text-gray-500 space-y-1 mb-3 bg-gray-50 p-2 rounded-lg">
                                                {Object.entries(
                                                    item.selectedOptions
                                                ).map(([key, value], idx) => (
                                                    <p key={idx}>
                                                        <span className="font-semibold">
                                                            {key}:
                                                        </span>{" "}
                                                        {value}
                                                    </p>
                                                ))}
                                            </div>
                                        )}

                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-3 gap-3">
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <div className="bg-gray-100 rounded-lg flex items-center h-8 shadow-sm border border-gray-200">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.cartId,
                                                            -1
                                                        )
                                                    }
                                                    className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-l-lg"
                                                >
                                                    <Minus
                                                        size={14}
                                                        strokeWidth={2.5}
                                                    />
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold bg-white h-[calc(100%-4px)] flex items-center justify-center rounded-sm mx-0.5">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.cartId,
                                                            1
                                                        )
                                                    }
                                                    className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-r-lg"
                                                >
                                                    <Plus
                                                        size={14}
                                                        strokeWidth={2.5}
                                                    />
                                                </button>
                                            </div>
                                            <div className="flex gap-3 text-xs font-bold items-center">
                                                <span className="text-gray-300">
                                                    |
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        removeFromCart(
                                                            item.cartId
                                                        )
                                                    }
                                                    className="text-red-500 hover:underline"
                                                >
                                                    Xoá
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-right w-full md:w-auto">
                                            <div className="font-bold text-[#f48120] text-lg">
                                                {(
                                                    item.unitPrice *
                                                    item.quantity
                                                ).toLocaleString("vi-VN")}{" "}
                                                ₫
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:w-1/3 space-y-6">
                        {appliedCoupon && (
                            <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex justify-between items-center relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f48120]"></div>
                                <div>
                                    <h4 className="font-bold text-[#f48120] text-sm uppercase">
                                        {appliedCoupon.code}
                                    </h4>
                                    <p className="text-xs text-gray-500 max-w-[180px] truncate">
                                        {appliedCoupon.description}
                                    </p>
                                </div>
                                <span className="font-bold text-[#f48120]">
                                    -
                                    {parseInt(
                                        appliedCoupon.calculated_discount
                                    ).toLocaleString()}{" "}
                                    ₫
                                </span>
                            </div>
                        )}

                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                                Mã khuyến mãi
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Ticket
                                        className="absolute left-3 top-3 text-gray-400"
                                        size={18}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Nhập mã voucher"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#f48120]"
                                        value={voucherCode}
                                        onChange={(e) =>
                                            setVoucherCode(
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                    />
                                </div>
                                <button
                                    onClick={handleApplyVoucher}
                                    disabled={!voucherCode || isChecking}
                                    className="bg-[#f48120] text-white font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-[#d96e17] disabled:opacity-70 whitespace-nowrap"
                                >
                                    {isChecking ? "..." : "Áp dụng"}
                                </button>
                            </div>
                            {voucherError && (
                                <p className="text-xs text-red-500 mt-2 font-medium ml-1">
                                    {voucherError}
                                </p>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="space-y-3 pb-4 border-b border-gray-100 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tổng tiền hàng</span>
                                    <span className="font-medium">
                                        {subTotal.toLocaleString("vi-VN")} ₫
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Giảm giá</span>
                                    <span className="font-medium text-[#f48120]">
                                        {discountAmount > 0
                                            ? `-${discountAmount.toLocaleString(
                                                  "vi-VN"
                                              )} ₫`
                                            : "0 ₫"}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí giao hàng</span>
                                    <span className="font-medium">
                                        {shippingFee.toLocaleString("vi-VN")} ₫
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-4">
                                <span className="font-bold text-gray-800 text-lg">
                                    Tổng cộng
                                </span>
                                <span className="font-bold text-xl text-[#f48120]">
                                    {finalTotal.toLocaleString("vi-VN")} ₫
                                </span>
                            </div>

                            <Link href="/checkout">
                                <button className="w-full bg-[#f48120] text-white font-bold py-3 rounded-full hover:bg-[#d96e17] transition text-base uppercase tracking-wide">
                                    Thanh toán
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
