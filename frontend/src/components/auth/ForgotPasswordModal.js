"use client";
import React, { useState } from "react";
import { X, Loader2, Mail } from "lucide-react";
import { AuthService } from "@/services/authService";

export default function ForgotPasswordModal({ isOpen, onClose }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await AuthService.forgotPassword(email);
            alert("Đã gửi email! Vui lòng kiểm tra hộp thư (cả mục Spam).");
            onClose();
        } catch (error) {
            alert(error.response?.data?.message || "Lỗi gửi yêu cầu");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>

                <div className="p-8">
                    <h2 className="text-2xl font-extrabold text-center text-[#f48120] mb-2">
                        QUÊN MẬT KHẨU?
                    </h2>
                    <p className="text-center text-gray-500 text-sm mb-6">
                        Nhập email để nhận link đặt lại mật khẩu.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Email đăng ký
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-3 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f48120]"
                                    placeholder="email@example.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#f48120] hover:bg-[#d96e17] text-white font-bold py-3 rounded-xl transition flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                "Gửi yêu cầu"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
