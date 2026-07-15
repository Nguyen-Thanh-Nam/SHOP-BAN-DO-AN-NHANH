"use client";
import { useState } from "react";
import axiosClient from "@/services/axiosClient";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post("/auth/register", formData);
            toast.info("Đăng ký thành công! Vui lòng đăng nhập.");
            router.push("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Đăng ký thất bại");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">
                ĐĂNG KÝ
            </h2>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Họ tên"
                    required
                    className="w-full border p-2 rounded"
                    onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                    }
                />
                <input
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full border p-2 rounded"
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                />
                <input
                    type="text"
                    placeholder="Số điện thoại"
                    required
                    className="w-full border p-2 rounded"
                    onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                    }
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    required
                    className="w-full border p-2 rounded"
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                    }
                />
                <button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-2 rounded font-bold hover:bg-orange-700"
                >
                    Đăng Ký
                </button>
            </form>
        </div>
    );
}
