"use client";
import { useState } from "react";
import axiosClient from "@/services/axiosClient";
import useAuthStore from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const loginSuccess = useAuthStore((state) => state.loginSuccess);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axiosClient.post("/auth/login", {
                email,
                password,
            });

            if (res.data.success) {
                const { user, accessToken, refreshToken } = res.data.data;
                loginSuccess(user, accessToken, refreshToken);
                router.push("/profile");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Đăng nhập thất bại");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">
                ĐĂNG NHẬP
            </h2>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full border p-2 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    required
                    className="w-full border p-2 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-2 rounded font-bold hover:bg-orange-700"
                >
                    Đăng Nhập
                </button>
            </form>
        </div>
    );
}
