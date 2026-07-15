"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    LogOut,
    Ticket,
    Clock,
    Copy,
    Loader2,
    Check,
    MapPin,
    ShoppingBag,
    User,
} from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";
import { CouponService } from "@/services/couponService";

const VoucherCard = ({ voucher }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(voucher.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const calculateDaysLeft = (endDate) => {
        if (!endDate) return 0;
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const daysLeft = calculateDaysLeft(voucher.end_date);

    return (
        <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-orange-200 transition bg-white flex flex-col justify-between h-full group relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-100 group-hover:bg-[#f48120] transition-colors"></div>

            <div className="pl-2">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 text-base uppercase tracking-tight">
                        MÃ:{" "}
                        <span className="text-[#f48120]">{voucher.code}</span>
                    </h3>
                    <button
                        onClick={handleCopy}
                        className="text-gray-400 hover:text-[#f48120] transition p-1"
                        title="Sao chép mã"
                    >
                        {copied ? (
                            <Check size={18} className="text-green-500" />
                        ) : (
                            <Copy size={18} />
                        )}
                    </button>
                </div>

                <div className="border-t border-dashed border-gray-200 my-3"></div>

                <div className="flex justify-between items-center text-xs">
                    <p className="text-sm text-gray-500 font-medium line-clamp-2">
                        {voucher.description}
                    </p>
                    <div
                        className={`font-medium flex items-center gap-1 ${
                            daysLeft <= 3 ? "text-red-500" : "text-gray-500"
                        }`}
                    >
                        <Clock size={14} />
                        {daysLeft > 0
                            ? `HSD: Còn ${daysLeft} ngày`
                            : "Đã hết hạn"}
                    </div>
                </div>
            </div>
        </div>
    );
};

const VoucherPage = () => {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVouchers = async () => {
            if (!user) return;
            try {
                const res = await CouponService.getAll();

                if (res && res.data) {
                    setVouchers(res.data);
                } else {
                    setVouchers([]);
                }
            } catch (error) {
                console.error("Lỗi tải voucher:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVouchers();
    }, [user]);

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    if (!user) return null;

    return (
        <div className="bg-white font-sans text-gray-800">
            <div className="container mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-3/4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h1 className="text-xl font-bold flex items-center gap-2 text-[#f48120]">
                                <Ticket className="text-[#f48120]" /> Ưu đãi của
                                tôi
                            </h1>
                            <span className="text-sm font-medium text-gray-500">
                                Tất cả ưu đãi ({vouchers.length})
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2
                                    className="animate-spin text-[#f48120]"
                                    size={40}
                                />
                            </div>
                        ) : vouchers.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                                <Ticket
                                    size={64}
                                    className="mx-auto text-gray-300 mb-4"
                                />
                                <p className="text-gray-500 font-medium">
                                    Hiện tại chưa có mã giảm giá nào.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {vouchers.map((voucher) => (
                                    <VoucherCard
                                        key={voucher.id}
                                        voucher={voucher}
                                    />
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
                                className="py-4 px-4 bg-orange-50 border-l-4 border-[#f48120] text-sm font-bold text-[#f48120] transition flex items-center gap-3"
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

export default VoucherPage;
