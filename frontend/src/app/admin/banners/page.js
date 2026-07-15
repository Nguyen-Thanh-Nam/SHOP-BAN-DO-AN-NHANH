"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    Plus,
    Trash2,
    Edit,
    Search,
    ChevronLeft,
    ChevronRight,
    Link as LinkIcon,
    Monitor,
    Smartphone,
    ImageIcon,
} from "lucide-react";
import { BannerService } from "@/services/bannerService";
import { toast } from "react-toastify";
import AuthGuard from "@/components/auth/AuthGuard";

export default function BannerListPage() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchData = async () => {
        try {
            const res = await BannerService.getAll();
            setBanners(res.data);
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
        if (confirm("Bạn có chắc muốn xóa banner này?")) {
            try {
                await BannerService.delete(id);
                fetchData();
            } catch (error) {
                toast.info("Xóa thất bại");
            }
        }
    };

    const getImageUrl = (path) => {
        if (!path) return "https://placehold.co/100?text=No+Img";
        return path.startsWith("/uploads")
            ? `${process.env.NEXT_PUBLIC_API_URL.replace("/api", "")}${path}`
            : path;
    };

    const filteredBanners = banners.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredBanners.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
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
                                Quản lý banners
                            </h1>
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
                                    placeholder="Tìm kiếm banners..."
                                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f48120]/20 focus:border-[#f48120] transition-all shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            <Link
                                href="/admin/banners/create"
                                className="bg-[#f48120] text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#d96e17] transition shadow-lg shadow-orange-200 whitespace-nowrap"
                            >
                                <Plus size={20} /> Thêm Banner
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-[20px] shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1 min-h-[400px]">
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/80 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                    <tr>
                                        <th className="p-6">Hình ảnh</th>
                                        <th className="p-6">Tên Banners</th>
                                        <th className="p-6">Thiết bị hỗ trợ</th>
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
                                                Không tìm thấy banner nào.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentData.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-gray-50/80 transition-colors group"
                                            >
                                                <td className="p-6">
                                                    <div className="w-32 h-16 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative bg-gray-100">
                                                        <img
                                                            src={getImageUrl(
                                                                item.image_desktop
                                                            )}
                                                            className="w-full h-full object-cover"
                                                            alt=""
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="font-bold text-gray-800 text-base">
                                                        {item.title}
                                                    </div>
                                                </td>

                                                <td className="p-6">
                                                    <div className="flex gap-2">
                                                        <div
                                                            className="p-1.5 bg-gray-100 rounded-lg text-gray-600 border border-gray-200"
                                                            title="Desktop"
                                                        >
                                                            <Monitor
                                                                size={18}
                                                            />
                                                        </div>
                                                        {item.image_mobile && (
                                                            <div
                                                                className="p-1.5 bg-purple-50 text-purple-600 rounded-lg border border-purple-100"
                                                                title="Mobile"
                                                            >
                                                                <Smartphone
                                                                    size={18}
                                                                />
                                                            </div>
                                                        )}
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
                                                            ? "Hiển thị"
                                                            : "Đã ẩn"}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <Link
                                                            href={`/admin/banners/${item.id}`}
                                                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-[#f48120] hover:border-[#f48120] transition shadow-sm"
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
                                <span className="text-sm text-gray-500">
                                    Hiển thị{" "}
                                    <span className="font-bold text-gray-800">
                                        {startIndex + 1}-
                                        {Math.min(
                                            startIndex + itemsPerPage,
                                            filteredBanners.length
                                        )}
                                    </span>{" "}
                                    trong{" "}
                                    <span className="font-bold text-gray-800">
                                        {filteredBanners.length}
                                    </span>{" "}
                                    banner
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)
                                        }
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
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
                                        className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
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
