"use client";
import Link from "next/link";
import useAuthStore from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import axiosClient from "@/services/axiosClient";

export default function Navbar() {
    const { isAuthenticated, user, logout, refreshToken } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await axiosClient.post("/auth/logout", { refreshToken });
        } catch (error) {
            console.error("Lỗi logout server", error);
        }
        logout();
        router.push("/login");
    };

    return (
        <nav className="bg-orange-600 p-4 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                    POPEYES CLONE
                </Link>

                <div className="space-x-4 flex items-center">
                    {isAuthenticated ? (
                        <>
                            <span className="font-medium">
                                Xin chào, {user?.full_name}
                            </span>
                            <Link
                                href="/profile"
                                className="bg-orange-700 px-3 py-1 rounded hover:bg-orange-800"
                            >
                                Hồ sơ
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-white text-orange-600 px-3 py-1 rounded font-bold hover:bg-gray-100"
                            >
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:underline">
                                Đăng nhập
                            </Link>
                            <Link
                                href="/register"
                                className="bg-white text-orange-600 px-4 py-2 rounded font-bold hover:bg-gray-100"
                            >
                                Đăng ký
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
