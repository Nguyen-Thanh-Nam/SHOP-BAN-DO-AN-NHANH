"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    Plus,
    Trash2,
    Edit,
    Calendar,
    Search,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { PromotionService } from "@/services/promotionService";
import { toast } from "react-toastify";
import AuthGuard from "@/components/auth/AuthGuard";

export default function PromotionListPage() {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchData = async () => {
        try {
            const res = await PromotionService.getAll();
            setPromotions(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (confirm("Bạn có chắc muốn xóa chương trình này?")) {
            try {
                await PromotionService.delete(id);
                fetchData();
            } catch (error) {
                toast.info("Xóa thất bại");
            }
        }
    };

    const getImageUrl = (path) => {
        if (!path) return "https://placehold.co/100?text=No+Img";
        return path.startsWith("/uploads")
            ? `${(process.env.NEXT_PUBLIC_API_URL || "").replace("/api", "")}${path}`
            : path;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "...";
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const filteredPromotions = promotions.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredPromotions.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <div className="min-h-screen bg-gray-50/50 p-8 flex-1 flex flex-col">
                <div className="w-full space-y-8 flex-1 flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                Quản lý Khuyến Mãi
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Danh sách các chương trình ưu đãi hiện có.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <div className="relative group w-full sm:w-72">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search
                                        size={18}
                                        className="text-gray-400 group-focus-within:text-[#f48120] transition-colors"
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm chương trình..."
                                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f48120]/20 focus:border-[#f48120] transition-all shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>

                            <Link
                                href="/admin/promotions/create"
                                className="bg-[#f48120] text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#d96e17] transition shadow-lg shadow-orange-200 whitespace-nowrap"
                            >
                                <Plus size={20} /> Thêm chương trình
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-[20px] shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1 min-h-[400px]">
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/80 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                    <tr>
                                        <th className="p-6">Hình ảnh</th>
                                        <th className="p-6">
                                            Tên chương trình
                                        </th>
                                        <th className="p-6">
                                            Thời gian áp dụng
                                        </th>
                                        <th className="p-6">Trạng thái</th>
                                        <th className="p-6 text-right">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="p-12 text-center text-gray-500"
                                            >
                                                Đang tải dữ liệu...
                                            </td>
                                        </tr>
                                    ) : currentData.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="p-12 text-center text-gray-500"
                                            >
                                                Không tìm thấy kết quả nào.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentData.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-gray-50/80 transition-colors group"
                                            >
                                                <td className="p-6">
                                                    <div className="w-20 h-14 rounded-lg overflow-hidden border border-gray-200 shadow-sm relative bg-gray-100">
                                                        <img
                                                            src={getImageUrl(
                                                                item.image
                                                            )}
                                                            className="w-full h-full object-cover"
                                                            alt=""
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="font-bold text-gray-800 text-base">
                                                        {item.name}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1 truncate max-w-[200px]">
                                                        {item.slug}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg w-fit whitespace-nowrap">
                                                        <Calendar
                                                            size={14}
                                                            className="text-gray-400"
                                                        />
                                                        <span className="font-medium">
                                                            {formatDate(
                                                                item.start_date
                                                            )}
                                                        </span>
                                                        <span className="text-gray-400">
                                                            -
                                                        </span>
                                                        <span className="font-medium">
                                                            {formatDate(
                                                                item.end_date
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                                            item.is_active
                                                                ? "bg-green-50 text-green-700 border border-green-100"
                                                                : "bg-gray-100 text-gray-500 border border-gray-200"
                                                        }`}
                                                    >
                                                        <span
                                                            className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                                                item.is_active
                                                                    ? "bg-green-500"
                                                                    : "bg-gray-400"
                                                            }`}
                                                        ></span>
                                                        {item.is_active
                                                            ? "Đang chạy"
                                                            : "Đã tắt"}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <Link
                                                            href={`/admin/promotions/${item.id}`}
                                                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-[#f48120] hover:border-[#f48120] transition shadow-sm"
                                                            title="Sửa"
                                                        >
                                                            <Edit size={18} />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item.id
                                                                )
                                                            }
                                                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-red-600 hover:border-red-200 transition shadow-sm"
                                                            title="Xóa"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
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
                                            filteredPromotions.length
                                        )}
                                    </span>{" "}
                                    trong tổng số{" "}
                                    <span className="font-bold text-gray-800">
                                        {filteredPromotions.length}
                                    </span>{" "}
                                    kết quả
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
                                            onClick={() =>
                                                handlePageChange(page)
                                            }
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
        </AuthGuard>
    );
}
