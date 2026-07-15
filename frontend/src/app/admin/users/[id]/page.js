"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { UserService } from "@/services/userService";

import {
    ArrowLeft,
    Loader2,
    Save,
    User,
    Shield,
    Lock,
    MapPin,
    Briefcase,
    Calendar,
    Phone,
    Eye,
    EyeOff,
    KeyRound,
} from "lucide-react";
import { toast } from "react-toastify";
import AuthGuard from "@/components/auth/AuthGuard";

export default function UserDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showPass, setShowPass] = useState(false);

    const [info, setInfo] = useState({
        full_name: "",
        email: "",
        phone: "",
        gender: "Other",
        birthday: "",
        role: "user",
        is_active: 1,
        password: "",
    });
    console.log(info);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await UserService.getUserDetail(params.id);
                setInfo({
                    full_name: res.full_name || "",
                    email: res.email || "",
                    phone: res.phone || "",
                    gender: res.gender || "Other",
                    birthday: res.birthday
                        ? new Date(res.birthday).toISOString().split("T")[0]
                        : "",
                    role: res.role || "user",
                    is_active: res.is_active,
                    password: "",
                });
            } catch (error) {
                console.error(error);
                toast.info("Không tìm thấy user");
                router.push("/admin/users");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.id, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = { ...info };

            await UserService.updateUser(params.id, payload);
            toast.info("Cập nhật thành công!");
            router.push("/admin/users");
        } catch (error) {
            toast.info(
                "Lỗi: " + (error.response?.data?.message || error.message)
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center text-[#f48120]">
                <Loader2 size={40} className="animate-spin" />
            </div>
        );

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <div className="min-h-screen bg-gray-100 px-6 py-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => router.back()}
                            className="bg-white p-3 rounded-full shadow-sm border border-gray-200 hover:border-[#f48120] hover:text-[#f48120] transition group"
                        >
                            <ArrowLeft
                                size={20}
                                className="text-gray-600 group-hover:text-[#f48120]"
                            />
                        </button>
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                Chi tiết Người dùng
                            </h1>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-200/60">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-orange-100 p-2.5 rounded-xl">
                                        <User
                                            size={22}
                                            className="text-[#f48120]"
                                        />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Thông tin cơ bản
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            value={info.full_name}
                                            onChange={(e) =>
                                                setInfo({
                                                    ...info,
                                                    full_name: e.target.value,
                                                })
                                            }
                                            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:border-[#f48120] focus:ring-4 focus:ring-[#f48120]/10 outline-none transition"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                disabled
                                                value={info.email}
                                                className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Số điện thoại
                                            </label>
                                            <div className="relative">
                                                <Phone
                                                    size={18}
                                                    className="absolute left-4 top-3.5 text-gray-400"
                                                />
                                                <input
                                                    type="text"
                                                    value={info.phone}
                                                    onChange={(e) =>
                                                        setInfo({
                                                            ...info,
                                                            phone: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-300 focus:border-[#f48120] outline-none transition"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Giới tính
                                            </label>
                                            <select
                                                value={info.gender}
                                                onChange={(e) =>
                                                    setInfo({
                                                        ...info,
                                                        gender: e.target.value,
                                                    })
                                                }
                                                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:border-[#f48120] outline-none bg-white"
                                            >
                                                <option value="Male">
                                                    Nam
                                                </option>
                                                <option value="Female">
                                                    Nữ
                                                </option>
                                                <option value="Other">
                                                    Khác
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Ngày sinh
                                            </label>
                                            <div className="relative">
                                                <Calendar
                                                    size={18}
                                                    className="absolute left-4 top-3.5 text-gray-400"
                                                />
                                                <input
                                                    type="date"
                                                    value={info.birthday}
                                                    onChange={(e) =>
                                                        setInfo({
                                                            ...info,
                                                            birthday:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-300 focus:border-[#f48120] outline-none transition"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-200/60 sticky top-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-blue-100 p-2.5 rounded-xl">
                                        <Shield
                                            size={22}
                                            className="text-blue-600"
                                        />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Cài đặt tài khoản
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Vai trò hệ thống
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={info.role}
                                                onChange={(e) =>
                                                    setInfo({
                                                        ...info,
                                                        role: e.target.value,
                                                    })
                                                }
                                                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:border-[#f48120] outline-none bg-white appearance-none cursor-pointer font-medium"
                                            >
                                                <option value="user">
                                                    Khách hàng (User)
                                                </option>
                                                <option value="staff">
                                                    Nhân viên (Staff)
                                                </option>
                                                <option value="admin">
                                                    Quản trị viên (Admin)
                                                </option>
                                            </select>
                                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                                <Briefcase
                                                    size={16}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 my-4"></div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Đặt lại mật khẩu
                                        </label>
                                        <div className="relative">
                                            <KeyRound
                                                size={18}
                                                className="absolute left-4 top-3.5 text-gray-400"
                                            />
                                            <input
                                                type={
                                                    showPass
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={info.password}
                                                onChange={(e) =>
                                                    setInfo({
                                                        ...info,
                                                        password:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Nhập mật khẩu mới..."
                                                className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-300 focus:border-[#f48120] outline-none transition"
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPass(!showPass)
                                                }
                                                className="absolute right-4 top-3.5 text-gray-400 hover:text-[#f48120]"
                                            >
                                                {showPass ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2 ml-1 italic">
                                            * Để trống nếu không muốn đổi mật
                                            khẩu.
                                        </p>
                                    </div>

                                    <div className="border-t border-gray-100 my-4"></div>

                                    <div>
                                        <label className="flex items-center justify-between cursor-pointer group p-3 border border-gray-200 rounded-xl hover:border-gray-300 transition bg-gray-50/50">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`p-2 rounded-lg ${
                                                        info.is_active
                                                            ? "bg-green-100 text-green-600"
                                                            : "bg-red-100 text-red-600"
                                                    }`}
                                                >
                                                    <Lock size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800 text-sm">
                                                        Trạng thái hoạt động
                                                    </div>
                                                    <div
                                                        className={`text-xs ${
                                                            info.is_active
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }`}
                                                    >
                                                        {info.is_active
                                                            ? "Đang mở"
                                                            : "Đã khóa"}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={info.is_active}
                                                    onChange={(e) =>
                                                        setInfo({
                                                            ...info,
                                                            is_active: e.target
                                                                .checked
                                                                ? 1
                                                                : 0,
                                                        })
                                                    }
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f48120]"></div>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="pt-4 flex flex-col gap-3">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="w-full py-3.5 bg-[#f48120] hover:bg-[#d96e17] text-white font-bold rounded-xl shadow-lg shadow-orange-200 flex items-center justify-center gap-2 transition disabled:opacity-70"
                                        >
                                            {saving ? (
                                                <Loader2
                                                    className="animate-spin"
                                                    size={20}
                                                />
                                            ) : (
                                                <Save size={20} />
                                            )}
                                            Lưu thay đổi
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => router.back()}
                                            className="w-full py-3.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
                                        >
                                            Hủy bỏ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthGuard>
    );
}
