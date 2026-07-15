"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";
import { toast } from "react-toastify";

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const { register, isLoading } = useAuthStore();

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [localError, setLocalError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setLocalError(null);
            setFormData({
                full_name: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);

        if (
            !formData.full_name ||
            !formData.email ||
            !formData.phone ||
            !formData.password
        ) {
            setLocalError("Vui lòng điền đầy đủ thông tin");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setLocalError("Mật khẩu xác nhận không khớp");
            return;
        }
        if (formData.password.length < 6) {
            setLocalError("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        const { confirmPassword, ...registerData } = formData;
        const payload = { ...registerData, gender: "Other", birthday: null };

        const result = await register(payload);

        if (result.success) {
            toast.info("Đăng ký thành công! Vui lòng đăng nhập.");
            onSwitchToLogin();
        } else {
            setLocalError(result.error);
        }
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200 overflow-y-auto"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10"
                >
                    <X size={24} />
                </button>

                <div className="flex justify-center space-x-8 pt-8 pb-4 relative relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gray-200">
                    <button
                        onClick={onSwitchToLogin}
                        className="text-gray-400 font-bold text-lg pb-2 hover:text-gray-600 transition relative top-[1px]"
                    >
                        Đăng nhập
                    </button>
                    <button className="text-[#f48120] font-bold text-lg pb-2 border-b-2 border-[#f48120] relative top-[1px] z-10">
                        Tạo tài khoản
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
                    {localError && (
                        <div className="p-3 bg-red-100 text-red-600 text-sm rounded-lg text-center font-medium border border-red-200">
                            {localError}
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="full_name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            id="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="Nhập họ và tên"
                            className="w-full py-2 border-b border-gray-300 focus:border-[#f48120] outline-none transition placeholder-gray-300 text-gray-700"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nhập email"
                            className="w-full py-2 border-b border-gray-300 focus:border-[#f48120] outline-none transition placeholder-gray-300 text-gray-700"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Số điện thoại
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                            className="w-full py-2 border-b border-gray-300 focus:border-[#f48120] outline-none transition placeholder-gray-300 text-gray-700"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            className="w-full py-2 border-b border-gray-300 focus:border-[#f48120] outline-none transition placeholder-gray-300 text-gray-700"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Nhập lại mật khẩu"
                            className="w-full py-2 border-b border-gray-300 focus:border-[#f48120] outline-none transition placeholder-gray-300 text-gray-700"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-[#f48120] text-white font-bold rounded-full hover:bg-[#d96e17] transition uppercase shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "ĐANG TẠO..." : "TẠO TÀI KHOẢN"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterModal;
