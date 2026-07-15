"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";
import useCartStore from "@/stores/useCartStore";

const LoginModal = ({ isOpen, onClose, onSwitchToRegister, onOpenForgot }) => {
    const { login, isLoading } = useAuthStore();
    const fetchCartFromDB = useCartStore((state) => state.fetchCartFromDB);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setLocalError(null);
            setEmail("");
            setPassword("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);

        if (!email || !password) {
            setLocalError("Vui lòng nhập đầy đủ email và mật khẩu");
            return;
        }

        const result = await login(email, password);

        if (result.success) {
            onClose();
            await fetchCartFromDB();
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
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10"
                    onClick={onClose}
                >
                    <X size={24} />
                </button>

                <div className="flex justify-center space-x-8 pt-8 pb-4 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gray-200">
                    <button className="text-[#f48120] font-bold text-lg pb-2 border-b-2 border-[#f48120] relative top-[1px] z-10">
                        Đăng nhập
                    </button>
                    <button
                        onClick={onSwitchToRegister}
                        className="text-gray-400 font-bold text-lg pb-2 hover:text-gray-600 transition relative top-[1px]"
                    >
                        Tạo tài khoản
                    </button>
                </div>

                <div className="relative p-8">
                    {localError && (
                        <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg text-center font-medium border border-red-200">
                            {localError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email"
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu"
                                className="w-full py-2 border-b border-gray-300 focus:border-[#f48120] outline-none transition placeholder-gray-300 text-gray-700"
                            />
                        </div>

                        <div className="flex justify-end mt-2 mb-4">
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onOpenForgot();
                                }}
                                className="text-sm font-bold text-[#f48120] hover:underline"
                            >
                                Quên mật khẩu?
                            </button>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-[#f48120] text-white font-bold rounded-full hover:bg-[#d96e17] transition uppercase shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
