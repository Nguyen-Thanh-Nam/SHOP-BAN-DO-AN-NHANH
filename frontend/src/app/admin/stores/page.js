"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    Plus,
    Trash2,
    Edit,
    MapPin,
    Phone,
    Clock,
    Search,
    Loader2,
} from "lucide-react";
import { StoreService } from "@/services/storeService";
import { toast } from "react-toastify";
import AuthGuard from "@/components/auth/AuthGuard";

export default function StoreListPage() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        try {
            const res = await StoreService.getAll();
            setStores(res.data);
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
        if (confirm("Bạn có chắc muốn xóa cửa hàng này?")) {
            try {
                await StoreService.delete(id);
                fetchData();
            } catch (error) {
                toast.info("Xóa thất bại");
            }
        }
    };

    const filteredStores = stores.filter(
        (store) =>
            store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <div className="min-h-screen bg-gray-50/50 p-8 flex-1 flex flex-col">
                <div className="w-full space-y-8 flex-1 flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                Quản lý cửa hàng
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
                                    placeholder="Tìm tên hoặc địa chỉ..."
                                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f48120]/20 focus:border-[#f48120] transition-all shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            <Link
                                href="/admin/stores/create"
                                className="bg-[#f48120] text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#d96e17] transition shadow-lg shadow-orange-200 whitespace-nowrap"
                            >
                                <Plus size={20} /> Thêm Cửa Hàng
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-[20px] shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/80 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                    <tr>
                                        <th className="p-6">Tên Chi Nhánh</th>
                                        <th className="p-6">
                                            Địa chỉ / Liên hệ
                                        </th>
                                        <th className="p-6">Giờ hoạt động</th>
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
                                    ) : filteredStores.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="p-12 text-center text-gray-500"
                                            >
                                                Không tìm thấy cửa hàng nào.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredStores.map((store) => (
                                            <tr
                                                key={store.id}
                                                className="hover:bg-gray-50/80 transition-colors group"
                                            >
                                                <td className="p-6">
                                                    <div className="font-bold text-gray-800 text-base">
                                                        {store.name}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        ID: #{store.id}
                                                    </div>
                                                </td>
                                                <td className="p-6 max-w-xs">
                                                    <div className="flex items-start gap-2 text-sm text-gray-600 mb-1">
                                                        <MapPin
                                                            size={16}
                                                            className="mt-0.5 text-[#f48120] shrink-0"
                                                        />
                                                        <span className="line-clamp-2">
                                                            {store.address}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Phone
                                                            size={14}
                                                            className="text-blue-500"
                                                        />
                                                        <span>
                                                            {store.phone ||
                                                                "Chưa cập nhật"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-1.5 rounded-lg w-fit text-gray-700 font-medium">
                                                        <Clock
                                                            size={14}
                                                            className="text-green-600"
                                                        />
                                                        {store.open_time?.slice(
                                                            0,
                                                            5
                                                        )}{" "}
                                                        -{" "}
                                                        {store.close_time?.slice(
                                                            0,
                                                            5
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                                            store.is_active
                                                                ? "bg-green-50 text-green-700 border border-green-100"
                                                                : "bg-red-50 text-red-700 border border-red-100"
                                                        }`}
                                                    >
                                                        <span
                                                            className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                                                store.is_active
                                                                    ? "bg-green-500"
                                                                    : "bg-red-500"
                                                            }`}
                                                        ></span>
                                                        {store.is_active
                                                            ? "Hoạt động"
                                                            : "Đóng cửa"}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <Link
                                                            href={`/admin/stores/${store.id}`}
                                                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-[#f48120] hover:border-[#f48120] transition shadow-sm"
                                                        >
                                                            <Edit size={18} />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    store.id
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
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
