"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/services/authService";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }
        if (password.length < 6) {
            alert("Mật khẩu phải từ 6 ký tự");
            return;
        }

        setLoading(true);
        try {
            await AuthService.resetPassword({ token, newPassword: password });
            alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
            router.push("/?login=true");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Link đã hết hạn hoặc không hợp lệ"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!token)
        return (
            <div className="text-center text-red-500">Link không hợp lệ.</div>
        );

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100"
        >
            <h1 className="text-2xl font-bold text-center text-[#f48120] mb-6">
                ĐẶT LẠI MẬT KHẨU
            </h1>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                        Mật khẩu mới
                    </label>
                    <div className="relative">
                        <input
                            type={showPass ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#f48120] outline-none"
                            placeholder="Nhập mật khẩu mới"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-3.5 text-gray-400 hover:text-[#f48120]"
                        >
                            {showPass ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                        Xác nhận mật khẩu
                    </label>
                    <input
                        type={showPass ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#f48120] outline-none"
                        placeholder="Nhập lại mật khẩu"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#f48120] hover:bg-[#d96e17] text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-200 transition flex justify-center items-center gap-2 mt-2"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        "Xác nhận đổi"
                    )}
                </button>
            </div>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <Suspense
                fallback={<Loader2 className="animate-spin text-[#f48120]" />}
            >
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
