"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import axiosClient from "@/services/axiosClient";
import Link from "next/link";
import { toast } from "react-toastify";

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading, fetchUser } = useAuthStore();
    const router = useRouter();

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        gender: "",
        day: "",
        month: "",
        year: "",
        address: "",
    });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }

        if (user) {
            let d = "",
                m = "",
                y = "";
            if (user.birthday) {
                const dateObj = new Date(user.birthday);
                d = dateObj.getDate().toString();
                m = (dateObj.getMonth() + 1).toString();
                y = dateObj.getFullYear().toString();
            }

            setFormData({
                full_name: user.full_name || "",
                email: user.email || "",
                phone: user.phone || "",
                gender: user.gender || "Khác",
                day: d,
                month: m,
                year: y,
                address: user.address || "",
            });
        }
    }, [user, isAuthenticated, isLoading, router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        setIsSaving(true);
        try {
            let birthday = null;
            if (formData.year && formData.month && formData.day) {
                birthday = `${formData.year}-${formData.month.padStart(
                    2,
                    "0"
                )}-${formData.day.padStart(2, "0")}`;
            }

            const payload = {
                full_name: formData.full_name,
                gender: formData.gender,
                birthday: birthday,
                address: formData.address,
            };

            const res = await axiosClient.put("/auth/profile", payload);

            if (res.data.success) {
                toast.info("Cập nhật thành công!");
                fetchUser();
            }
        } catch (error) {
            toast.info(
                "Lỗi cập nhật: " +
                    (error.response?.data?.message || error.message)
            );
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || !user)
        return (
            <div className="p-10 text-center text-orange-600">Đang tải...</div>
        );

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from(
        { length: 100 },
        (_, i) => new Date().getFullYear() - i
    );

    return (
        <div className="container mx-auto py-10 px-4 bg-gray-50 min-h-screen">
            <div className="flex justify-center items-center min-h-[50vh] bg-white">
                <svg
                    width="150px"
                    height="150px"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g
                        stroke="#ff7c00"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M35 45 L38 75 Q39 78 42 78 L58 78 Q61 78 62 75 L65 45" />

                        <path d="M36 55 L64 55" strokeWidth="2" />
                        <path d="M37 68 L63 68" strokeWidth="2" />

                        <rect x="32" y="40" width="36" height="5" rx="2" />

                        <circle
                            cx="50"
                            cy="62"
                            r="2"
                            fill="#ff7c00"
                            stroke="none"
                        />

                        <path d="M35 38 Q30 30 35 25 Q40 30 42 38" />
                        <circle
                            cx="33"
                            cy="25"
                            r="2"
                            fill="none"
                            strokeWidth="2"
                        />

                        <path d="M65 38 Q70 30 65 25 Q60 30 58 38" />
                        <circle
                            cx="67"
                            cy="25"
                            r="2"
                            fill="none"
                            strokeWidth="2"
                        />

                        <path d="M42 38 Q50 25 58 38" />
                    </g>

                    <g id="particles" fill="#ff7c00">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 50 50"
                            to="360 50 50"
                            dur="3s"
                            repeatCount="indefinite"
                        />

                        <circle cx="50" cy="10" r="1.5" />
                        <circle cx="90" cy="50" r="1.5" />
                        <circle cx="50" cy="90" r="1.5" />
                        <circle cx="10" cy="50" r="1.5" />

                        <path d="M20 20 L23 25 L17 25 Z" />
                        <path
                            d="M80 80 L83 85 L77 85 Z"
                            transform="rotate(180 80 80)"
                        />

                        <rect
                            x="75"
                            y="20"
                            width="4"
                            height="2"
                            transform="rotate(45 77 21)"
                        />
                        <rect
                            x="20"
                            y="75"
                            width="4"
                            height="2"
                            transform="rotate(45 22 76)"
                        />

                        <circle cx="30" cy="15" r="1" opacity="0.8" />
                        <circle cx="70" cy="85" r="1" opacity="0.8" />
                        <circle cx="85" cy="35" r="1" opacity="0.8" />
                        <circle cx="15" cy="65" r="1" opacity="0.8" />

                        <rect x="49" y="5" width="2" height="4" rx="1" />
                        <rect x="91" y="49" width="4" height="2" rx="1" />
                    </g>
                </svg>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-3/4">
                    <h1 className="text-xl font-bold text-orange-600 mb-4 md:hidden">
                        Cài đặt
                    </h1>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center md:text-left">
                            Thông tin tài khoản
                        </h2>

                        <div className="space-y-6 max-w-lg mx-auto md:mx-0">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Họ tên
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-orange-500 bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    disabled
                                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Giới tính
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-orange-500 bg-white"
                                >
                                    <option value="Khác">Chưa xác định</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sinh nhật
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    <select
                                        name="day"
                                        value={formData.day}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-2 py-2 focus:border-orange-500 bg-white"
                                    >
                                        <option value="">Ngày</option>
                                        {days.map((d) => (
                                            <option key={d} value={d}>
                                                {d}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        name="month"
                                        value={formData.month}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-2 py-2 focus:border-orange-500 bg-white"
                                    >
                                        <option value="">Tháng</option>
                                        {months.map((m) => (
                                            <option key={m} value={m}>
                                                {m}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-2 py-2 focus:border-orange-500 bg-white"
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Địa chỉ
                                </label>
                                <div className="border border-gray-300 rounded px-3 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-50 group">
                                    <span className="text-sm text-gray-600">
                                        Bấm để xem và quản lý địa chỉ
                                    </span>
                                    <span className="text-gray-400 group-hover:text-orange-500">
                                        ›
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleUpdate}
                                disabled={isSaving}
                                className="w-full bg-orange-500 text-white font-bold py-3 rounded-full hover:bg-orange-600 transition shadow-md disabled:bg-gray-400"
                            >
                                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/4">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <ul className="text-sm text-gray-700">
                            <li className="bg-gray-100 font-medium text-gray-900 border-b border-gray-100">
                                <Link
                                    href="/profile"
                                    className="block px-4 py-3"
                                >
                                    Thông tin tài khoản
                                </Link>
                            </li>
                            <li className="border-b border-gray-100 hover:bg-gray-50">
                                <Link
                                    href="/profile/vouchers"
                                    className="block px-4 py-3"
                                >
                                    Ưu đãi của tôi
                                </Link>
                            </li>
                            <li className="border-b border-gray-100 hover:bg-gray-50">
                                <Link
                                    href="/profile/history"
                                    className="block px-4 py-3"
                                >
                                    Lịch sử đơn hàng
                                </Link>
                            </li>
                            <li className="border-b border-gray-100 hover:bg-gray-50">
                                <Link
                                    href="/profile/address"
                                    className="block px-4 py-3 flex items-center"
                                >
                                    <span className="mr-2">‹</span> Địa chỉ giao
                                    hàng của tôi
                                </Link>
                            </li>
                            <li className="hover:bg-gray-50 cursor-pointer">
                                <button
                                    onClick={() => {
                                        useAuthStore.getState().logout();
                                        router.push("/login");
                                    }}
                                    className="block w-full text-left px-4 py-3 flex items-center font-medium"
                                >
                                    <span className="mr-2">🚪</span> Đăng xuất
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
