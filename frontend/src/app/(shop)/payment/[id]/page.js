"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { OrderService } from "@/services/orderService";
import { Loader2, CheckCircle, Copy } from "lucide-react";
import { toast } from "react-toastify";

const PaymentPage = () => {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPaid, setIsPaid] = useState(false);

    const BANK_ACC = "VQRQAFHGS9881";
    const BANK_NAME = "MBBank";
    const ACCOUNT_NAME = "BUI VAN MINH";

    const pollInterval = useRef(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await OrderService.getOrderDetail(orderId);
                setOrder(data);

                if (data.status !== "pending") {
                    setIsPaid(true);
                }
            } catch (error) {
                console.error("Lỗi lấy đơn hàng:", error);
                toast.info("Không tìm thấy đơn hàng");
                router.push("/");
            } finally {
                setLoading(false);
            }
        };

        if (orderId) fetchOrder();
    }, [orderId, router]);

    useEffect(() => {
        if (isPaid) return;

        const checkStatus = async () => {
            try {
                const data = await OrderService.getOrderDetail(orderId);
                console.log("Checking status...", data.status);
                if (
                    data.status === "processing" ||
                    data.status === "completed"
                ) {
                    setIsPaid(true);
                    clearInterval(pollInterval.current);
                }
            } catch (error) {
                console.error("Lỗi check status", error);
            }
        };

        pollInterval.current = setInterval(checkStatus, 3000);

        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, [orderId, isPaid]);

    useEffect(() => {
        if (isPaid) {
            setTimeout(() => {
                toast.info("Thanh toán thành công!");
                router.push("/");
            }, 2000);
        }
    }, [isPaid, router]);

    if (loading)
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Loader2 className="animate-spin text-[#f48120]" size={40} />
            </div>
        );
    if (!order) return null;

    const qrUrl = `https://qr.sepay.vn/img?acc=${BANK_ACC}&bank=${BANK_NAME}&amount=${order.total}&des=${orderId}`;

    return (
        <div className=" bg-gray-50 py-10 px-4">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-[#f48120] p-6 text-center text-white">
                    <h1 className="text-xl font-bold">Thanh toán đơn hàng</h1>
                </div>

                <div className="p-6">
                    {isPaid ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in fade-in zoom-in">
                            <CheckCircle size={80} className="text-green-500" />
                            <h2 className="text-2xl font-bold text-gray-800">
                                Thanh toán thành công!
                            </h2>
                            <p className="text-gray-500">
                                Cảm ơn bạn đã mua hàng.
                            </p>
                            <p className="text-sm text-gray-400">
                                Đang chuyển hướng...
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="relative w-64 h-64 border-2 border-[#f48120] rounded-lg p-2 mb-6">
                                <Image
                                    src={qrUrl}
                                    alt="QR Code Payment"
                                    fill
                                    className="object-contain"
                                    unoptimized={true}
                                />
                            </div>

                            <div className="w-full bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Chủ tài khoản:
                                    </span>
                                    <span className="font-bold text-gray-800 uppercase">
                                        {ACCOUNT_NAME}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">
                                        Số tài khoản:
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-800">
                                            {BANK_ACC}
                                        </span>
                                        <Copy
                                            size={14}
                                            className="cursor-pointer text-gray-400 hover:text-[#f48120]"
                                            onClick={() =>
                                                navigator.clipboard.writeText(
                                                    BANK_ACC
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Ngân hàng:
                                    </span>
                                    <span className="font-bold text-gray-800">
                                        {BANK_NAME}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Số tiền:
                                    </span>
                                    <span className="font-bold text-[#f48120] text-lg">
                                        {parseInt(order.total).toLocaleString()}{" "}
                                        đ
                                    </span>
                                </div>
                                <div className="flex justify-between items-center bg-yellow-50 p-2 rounded border border-yellow-100">
                                    <span className="text-gray-500">
                                        Nội dung:
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-red-600">
                                            {orderId}
                                        </span>
                                        <Copy
                                            size={14}
                                            className="cursor-pointer text-gray-400 hover:text-[#f48120]"
                                            onClick={() =>
                                                navigator.clipboard.writeText(
                                                    orderId
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center gap-2 text-gray-500 text-sm">
                                <Loader2 className="animate-spin" size={16} />
                                <span>Đang chờ thanh toán...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
