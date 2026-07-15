"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Edit,
    Trash2,
    User,
    Shield,
    Briefcase,
    Smartphone,
    Mail,
    Loader2,
} from "lucide-react";
import { UserService } from "@/services/userService";
import { toast } from "react-toastify";
import AuthGuard from "@/components/auth/AuthGuard";

export default function UserListPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await UserService.getAllUsers();
                const list = res.data || res || [];
                setUsers(list);
            } catch (error) {
                console.error("Lỗi tải users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (
            confirm(
                "Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
            )
        ) {
            try {
                await UserService.deleteUser(id);
                setUsers(users.filter((u) => u.id !== id));
                toast.info("Đã xóa thành công");
            } catch (e) {
                toast.info(
                    "Không thể xóa user này (Có thể do ràng buộc đơn hàng)."
                );
            }
        }
    };

    const filteredUsers = users.filter((item) => {
        const term = searchTerm.toLowerCase();
        const matchSearch =
            (item.full_name?.toLowerCase() || "").includes(term) ||
            (item.email?.toLowerCase() || "").includes(term) ||
            (item.phone?.toLowerCase() || "").includes(term);

        const matchRole = roleFilter === "all" || item.role === roleFilter;
        return matchSearch && matchRole;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredUsers.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, roleFilter]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <div className="min-h-screen bg-gray-50/50 p-8 flex-1 flex flex-col">
                <div className="w-full space-y-8 flex-1 flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                Quản lý người dùng
                            </h1>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <div className="relative">
                                <select
                                    className="appearance-none block w-full bg-white border border-gray-200 text-gray-700 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f48120]/20 focus:border-[#f48120] font-medium cursor-pointer shadow-sm transition-all"
                                    value={roleFilter}
                                    onChange={(e) =>
                                        setRoleFilter(e.target.value)
                                    }
                                >
                                    <option value="all">Tất cả vai trò</option>
                                    <option value="admin">Quản trị viên</option>
                                    <option value="staff">Nhân viên</option>
                                    <option value="user">Khách hàng</option>
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
                                    placeholder="Tìm tên, email, sđt..."
                                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f48120]/20 focus:border-[#f48120] transition-all shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[20px] shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1 min-h-[500px]">
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/80 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                    <tr>
                                        <th className="p-6">Người dùng</th>
                                        <th className="p-6">Liên hệ</th>
                                        <th className="p-6">Vai trò</th>
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
                                                <Loader2 className="animate-spin inline mr-2" />{" "}
                                                Đang tải...
                                            </td>
                                        </tr>
                                    ) : currentData.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="p-12 text-center text-gray-500"
                                            >
                                                Không tìm thấy người dùng nào.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentData.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-gray-50/80 transition-colors group"
                                            >
                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-200 shadow-sm shrink-0">
                                                            <User size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900">
                                                                {user.full_name ||
                                                                    "Chưa cập nhật"}
                                                            </div>
                                                            <div className="text-[10px] text-gray-400 font-mono">
                                                                ID: {user.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="p-6">
                                                    <div className="flex flex-col gap-1.5">
                                                        {user.email && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Mail
                                                                    size={14}
                                                                    className="text-gray-400"
                                                                />{" "}
                                                                {user.email}
                                                            </div>
                                                        )}
                                                        {(user.phone ||
                                                            user.phone_number) && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Smartphone
                                                                    size={14}
                                                                    className="text-gray-400"
                                                                />{" "}
                                                                {user.phone ||
                                                                    user.phone_number}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="p-6">
                                                    {user.role === "admin" && (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
                                                            <Shield size={14} />{" "}
                                                            Admin
                                                        </span>
                                                    )}
                                                    {user.role === "staff" && (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-100">
                                                            <Briefcase
                                                                size={14}
                                                            />{" "}
                                                            Nhân viên
                                                        </span>
                                                    )}
                                                    {user.role === "user" && (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                                            <User size={14} />{" "}
                                                            Khách hàng
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="p-6">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold 
                                                    ${
                                                        user.is_active
                                                            ? "bg-green-50 text-green-700 border border-green-100"
                                                            : "bg-red-50 text-red-700 border border-red-100"
                                                    }`}
                                                    >
                                                        <span
                                                            className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                                                user.is_active
                                                                    ? "bg-green-500"
                                                                    : "bg-red-500"
                                                            }`}
                                                        ></span>
                                                        {user.is_active
                                                            ? "Hoạt động"
                                                            : "Đã khóa"}
                                                    </span>
                                                </td>

                                                <td className="p-6 text-right">
                                                    <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <Link
                                                            href={`/admin/users/${user.id}`}
                                                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-[#f48120] hover:border-[#f48120] transition shadow-sm"
                                                        >
                                                            <Edit size={18} />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user.id
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
                            <div className="mt-auto border-t border-gray-200 px-6 py-4 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-sm text-gray-500">
                                    Hiển thị{" "}
                                    <span className="font-bold text-gray-800">
                                        {startIndex + 1}
                                    </span>{" "}
                                    đến{" "}
                                    <span className="font-bold text-gray-800">
                                        {Math.min(
                                            startIndex + itemsPerPage,
                                            filteredUsers.length
                                        )}
                                    </span>{" "}
                                    trong tổng số{" "}
                                    <span className="font-bold text-gray-800">
                                        {filteredUsers.length}
                                    </span>{" "}
                                    người dùng
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
