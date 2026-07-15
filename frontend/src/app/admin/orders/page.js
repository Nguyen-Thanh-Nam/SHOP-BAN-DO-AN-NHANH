"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Eye,
    Calendar,
    Filter,
} from "lucide-react";
import { OrderService } from "@/services/orderService";

export default function OrderListPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const fetchOrders = async () => {
        try {
            const res = await OrderService.getAllOrders();
            setOrders(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusBadge = (status) => {
        const styles = {
            pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
            processing: "bg-blue-50 text-blue-700 border-blue-200",
            completed: "bg-green-50 text-green-700 border-green-200",
            cancelled: "bg-red-50 text-red-700 border-red-200",
        };
        const labels = {
            pending: "Chờ xử lý",
            processing: "Đang giao",
            completed: "Hoàn thành",
            cancelled: "Đã hủy",
        };
        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                    styles[status] || styles.pending
                }`}
            >
                {labels[status] || status}
            </span>
        );
    };

    const filteredOrders = orders.filter((item) => {
        const matchSearch =
            item.id
                .toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            item.full_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus =
            statusFilter === "all" || item.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredOrders.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    return (
        <div className="min-h-screen bg-gray-50/50 p-8 flex-1 flex flex-col">
            <div className="w-full space-y-8 flex-1 flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Quản lý đơn hàng
                        </h1>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group w-full sm:w-48">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter size={18} className="text-gray-400" />
                            </div>
                            <select
                                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#f48120]/20 focus:border-[#f48120] transition-all shadow-sm appearance-none cursor-pointer"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="pending">Chờ xử lý</option>
                                <option value="processing">Đang giao</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>
                        </div>

                        <div className="relative group w-full sm:w-72">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search
                                    size={18}
                                    className="text-gray-400 group-focus-within:text-[#f48120]"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Tìm mã đơn, tên khách..."
                                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f48120]/20 focus:border-[#f48120] transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[20px] shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1 min-h-[500px]">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/80 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                <tr>
                                    <th className="p-6">Mã đơn hàng</th>
                                    <th className="p-6">Khách hàng</th>
                                    <th className="p-6">Ngày đặt</th>
                                    <th className="p-6">Tổng tiền</th>
                                    <th className="p-6">Trạng thái</th>
                                    <th className="p-6 text-right">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="p-12 text-center text-gray-500"
                                        >
                                            Đang tải dữ liệu...
                                        </td>
                                    </tr>
                                ) : currentData.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="p-12 text-center text-gray-500"
                                        >
                                            Không tìm thấy đơn hàng nào.
                                        </td>
                                    </tr>
                                ) : (
                                    currentData.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-gray-50/80 transition-colors group"
                                        >
                                            <td className="p-6 font-bold text-gray-700">
                                                #{order.id}
                                            </td>
                                            <td className="p-6">
                                                <div className="font-medium text-gray-900">
                                                    {order.full_name}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {order.phone_number}
                                                </div>
                                            </td>
                                            <td className="p-6 text-gray-500 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    {new Date(
                                                        order.created_at
                                                    ).toLocaleDateString(
                                                        "vi-VN"
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-6 font-bold text-[#f48120]">
                                                {parseInt(
                                                    order.total
                                                ).toLocaleString("vi-VN")}{" "}
                                                đ
                                            </td>
                                            <td className="p-6">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="p-6 text-right">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="inline-flex p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-[#f48120] hover:border-[#f48120] transition shadow-sm"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 0 && (
                        <div className="mt-auto border-t border-gray-200 px-6 py-4 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-500">
                                Hiển thị{" "}
                                <span className="font-bold text-gray-800">
                                    {startIndex + 1}
                                </span>{" "}
                                đến{" "}
                                <span className="font-bold text-gray-800">
                                    {Math.min(
                                        startIndex + itemsPerPage,
                                        filteredOrders.length
                                    )}
                                </span>{" "}
                                trong tổng số{" "}
                                <span className="font-bold text-gray-800">
                                    {filteredOrders.length}
                                </span>{" "}
                                đơn hàng
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1
                                ).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-9 h-9 rounded-lg text-sm font-bold transition shadow-sm ${
                                            currentPage === page
                                                ? "bg-[#f48120] text-white border border-[#f48120]"
                                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
