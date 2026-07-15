"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    LogOut,
    Camera,
    User,
    Ticket,
    ShoppingBag,
    MapPin,
    Loader2,
    Lock,
    KeyRound,
    Eye,
    EyeOff,
} from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";
import { AuthService } from "@/services/authService";
import { toast } from "react-toastify";

const ProfilePage = () => {
    const { user, logout, updateProfile, isLoading } = useAuthStore();
    const router = useRouter();
    const fileInputRef = useRef(null);

    const [avatarPreview, setAvatarPreview] = useState(
        "https://placehold.co/200x200/f48120/white?text=User"
    );
    const [avatarFile, setAvatarFile] = useState(null);
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        email: "",
        gender: "",
        birthDay: "",
        birthMonth: "",
        birthYear: "",
    });

    const [passData, setPassData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPass, setShowPass] = useState(false);
    const [passLoading, setPassLoading] = useState(false);

    useEffect(() => {
        if (user) {
            if (user.avatar) {
                const apiUrl =
                    process.env.NEXT_PUBLIC_API_URL ||
                    "http://localhost:4000/api";
                const baseUrl = apiUrl.replace("/api", "");
                const avatarUrl = user.avatar.startsWith("/uploads")
                    ? `${baseUrl}${user.avatar}`
                    : user.avatar;
                setAvatarPreview(avatarUrl);
            }

            let d = "",
                m = "",
                y = "";
            if (user.birthday) {
                const dateObj = new Date(user.birthday);
                d = dateObj.getDate();
                m = dateObj.getMonth() + 1;
                y = dateObj.getFullYear();
            }

            setFormData({
                full_name: user.full_name || "",
                phone: user.phone || "",
                email: user.email || "",
                gender: user.gender || "",
                birthDay: d,
                birthMonth: m,
                birthYear: y,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePassChange = (e) => {
        setPassData({ ...passData, [e.target.name]: e.target.value });
    };

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setAvatarPreview(objectUrl);
            setAvatarFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("full_name", formData.full_name);
        data.append("gender", formData.gender);
        data.append("birthDay", formData.birthDay);
        data.append("birthMonth", formData.birthMonth);
        data.append("birthYear", formData.birthYear);

        if (avatarFile) {
            data.append("avatar", avatarFile);
        }

        const result = await updateProfile(data);
        if (result.success) {
            toast.info("Cập nhật thông tin thành công!");
            setAvatarFile(null);
        } else {
            toast.info(result.error || "Có lỗi xảy ra.");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (
            !passData.currentPassword ||
            !passData.newPassword ||
            !passData.confirmPassword
        ) {
            toast.info("Vui lòng nhập đầy đủ thông tin mật khẩu.");
            return;
        }
        if (passData.newPassword !== passData.confirmPassword) {
            toast.info("Mật khẩu xác nhận không khớp!");
            return;
        }
        if (passData.newPassword.length < 6) {
            toast.info("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }

        setPassLoading(true);
        try {
            await AuthService.changePassword({
                currentPassword: passData.currentPassword,
                newPassword: passData.newPassword,
            });

            toast.info("Đổi mật khẩu thành công!");
            setPassData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            console.error(error);
            toast.info(
                error.response?.data?.message ||
                    "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ."
            );
        } finally {
            setPassLoading(false);
        }
    };

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    if (!user) return null;

    return (
        <div className="bg-white font-sans text-gray-800 min-h-screen">
            <div className="container mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-3/4 space-y-8">
                        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
                                <h1 className="text-xl font-bold flex items-center gap-2 text-[#f48120]">
                                    <User className="text-[#f48120]" /> Thông
                                    tin tài khoản
                                </h1>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col-reverse md:flex-row gap-10"
                            >
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#f48120] focus:ring-4 focus:ring-[#f48120]/10 outline-none transition"
                                            placeholder="Nhập họ tên của bạn"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed flex items-center gap-2">
                                                <span>{formData.email}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Số điện thoại
                                            </label>
                                            <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed flex items-center gap-2">
                                                <span>{formData.phone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Giới tính
                                        </label>
                                        <div className="flex gap-6">
                                            {["Male", "Female", "Other"].map(
                                                (g) => (
                                                    <label
                                                        key={g}
                                                        className="flex items-center gap-2 cursor-pointer group"
                                                    >
                                                        <div
                                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                                                                formData.gender ===
                                                                g
                                                                    ? "border-[#f48120]"
                                                                    : "border-gray-300 group-hover:border-[#f48120]"
                                                            }`}
                                                        >
                                                            {formData.gender ===
                                                                g && (
                                                                <div className="w-2.5 h-2.5 bg-[#f48120] rounded-full"></div>
                                                            )}
                                                        </div>
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value={g}
                                                            checked={
                                                                formData.gender ===
                                                                g
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            className="hidden"
                                                        />
                                                        <span className="text-gray-700 font-medium">
                                                            {g === "Male"
                                                                ? "Nam"
                                                                : g === "Female"
                                                                ? "Nữ"
                                                                : "Khác"}
                                                        </span>
                                                    </label>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Ngày sinh
                                        </label>
                                        <div className="grid grid-cols-3 gap-4">
                                            <select
                                                name="birthDay"
                                                value={formData.birthDay}
                                                onChange={handleChange}
                                                className="px-4 py-3 rounded-xl border border-gray-300 focus:border-[#f48120] outline-none bg-white cursor-pointer"
                                            >
                                                <option value="">Ngày</option>
                                                {days.map((d) => (
                                                    <option key={d} value={d}>
                                                        {d}
                                                    </option>
                                                ))}
                                            </select>
                                            <select
                                                name="birthMonth"
                                                value={formData.birthMonth}
                                                onChange={handleChange}
                                                className="px-4 py-3 rounded-xl border border-gray-300 focus:border-[#f48120] outline-none bg-white cursor-pointer"
                                            >
                                                <option value="">Tháng</option>
                                                {months.map((m) => (
                                                    <option key={m} value={m}>
                                                        {m}
                                                    </option>
                                                ))}
                                            </select>
                                            <select
                                                name="birthYear"
                                                value={formData.birthYear}
                                                onChange={handleChange}
                                                className="px-4 py-3 rounded-xl border border-gray-300 focus:border-[#f48120] outline-none bg-white cursor-pointer"
                                            >
                                                <option value="">Năm</option>
                                                {years.map((y) => (
                                                    <option key={y} value={y}>
                                                        {y}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-[#f48120] hover:bg-[#d96e17] text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:shadow-none min-w-[160px]"
                                        >
                                            {isLoading && (
                                                <Loader2
                                                    className="animate-spin"
                                                    size={20}
                                                />
                                            )}
                                            {isLoading
                                                ? "Đang lưu..."
                                                : "Lưu thay đổi"}
                                        </button>
                                    </div>
                                </div>

                                <div className="md:w-1/3 flex flex-col items-center justify-start border-l border-gray-100 md:pl-10">
                                    <div
                                        className="relative group cursor-pointer"
                                        onClick={handleAvatarClick}
                                    >
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-100 shadow-sm">
                                            <img
                                                src={avatarPreview}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera
                                                className="text-white"
                                                size={24}
                                            />
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAvatarClick}
                                        className="mt-4 text-sm font-bold text-gray-500 border border-gray-300 px-4 py-2 rounded-lg hover:border-[#f48120] hover:text-[#f48120] transition"
                                    >
                                        Chọn ảnh
                                    </button>
                                    <p className="text-xs text-gray-400 mt-3 text-center">
                                        Dụng lượng file tối đa 1 MB
                                        <br />
                                        Định dạng: .JPEG, .PNG
                                    </p>
                                </div>
                            </form>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                <h1 className="text-xl font-bold flex items-center gap-2 text-[#f48120]">
                                    <Lock className="text-[#f48120]" /> Đổi mật
                                    khẩu
                                </h1>
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="text-sm font-medium text-gray-500 hover:text-[#f48120] flex items-center gap-1 transition"
                                >
                                    {showPass ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                    {showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                </button>
                            </div>

                            <form
                                onSubmit={handlePasswordSubmit}
                                className="space-y-6 max-w-xl"
                            >
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Mật khẩu hiện tại
                                    </label>
                                    <div className="relative">
                                        <KeyRound
                                            size={18}
                                            className="absolute left-4 top-3.5 text-gray-400"
                                        />
                                        <input
                                            type={
                                                showPass ? "text" : "password"
                                            }
                                            name="currentPassword"
                                            value={passData.currentPassword}
                                            onChange={handlePassChange}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#f48120] focus:ring-4 focus:ring-[#f48120]/10 outline-none transition"
                                            placeholder="Nhập mật khẩu hiện tại"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Mật khẩu mới
                                        </label>
                                        <input
                                            type={
                                                showPass ? "text" : "password"
                                            }
                                            name="newPassword"
                                            value={passData.newPassword}
                                            onChange={handlePassChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#f48120] focus:ring-4 focus:ring-[#f48120]/10 outline-none transition"
                                            placeholder="Nhập mật khẩu mới"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Xác nhận mật khẩu
                                        </label>
                                        <input
                                            type={
                                                showPass ? "text" : "password"
                                            }
                                            name="confirmPassword"
                                            value={passData.confirmPassword}
                                            onChange={handlePassChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#f48120] focus:ring-4 focus:ring-[#f48120]/10 outline-none transition"
                                            placeholder="Nhập lại mật khẩu mới"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={passLoading}
                                        className="bg-white border border-[#f48120] text-[#f48120] hover:bg-[#f48120] hover:text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:shadow-none min-w-[160px]"
                                    >
                                        {passLoading && (
                                            <Loader2
                                                className="animate-spin"
                                                size={20}
                                            />
                                        )}
                                        {passLoading
                                            ? "Đang xử lý..."
                                            : "Cập nhật mật khẩu"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="w-full md:w-1/4 border-l border-gray-100 md:pl-0">
                        <div className="flex flex-col sticky top-24 bg-white rounded-xl">
                            <Link
                                href="/account/profile"
                                className="py-4 px-4 bg-orange-50 border-l-4 border-[#f48120] text-sm font-bold text-[#f48120] transition flex items-center gap-3"
                            >
                                <User size={18} /> Thông tin tài khoản
                            </Link>

                            <Link
                                href="/account/vouchers"
                                className="py-4 px-4 border-b border-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-3"
                            >
                                <Ticket size={18} className="text-gray-400" />{" "}
                                Ưu đãi của tôi
                            </Link>

                            <Link
                                href="/account/orders"
                                className="py-4 px-4 border-b border-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-3"
                            >
                                <ShoppingBag
                                    size={18}
                                    className="text-gray-400"
                                />{" "}
                                Lịch sử đơn hàng
                            </Link>

                            <Link
                                href="/account/address"
                                className="py-4 px-4 border-b border-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-3"
                            >
                                <MapPin size={18} className="text-gray-400" />{" "}
                                Địa chỉ giao hàng
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

export default ProfilePage;
