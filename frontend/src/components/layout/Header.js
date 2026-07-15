"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    User,
    ShoppingBasket,
    ChevronDown,
    FileText,
    BadgePercent,
    Receipt,
    LayoutDashboard,
} from "lucide-react";

import useAuthStore from "@/stores/useAuthStore";
import useCartStore from "@/stores/useCartStore";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";
import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";
import Image from "next/image";

const Header = () => {
    const router = useRouter();
    const { user } = useAuthStore();
    const cartItems = useCartStore((state) => state.items);
    const [mounted, setMounted] = useState(false);

    const getUserInitial = () => {
        if (!user) return "";
        const name = user.full_name || user.email || "U";
        return name.charAt(0).toUpperCase();
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    const cartCount = mounted
        ? cartItems.reduce((total, item) => total + item.quantity, 0)
        : 0;

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isForgotOpen, setIsForgotOpen] = useState(false);

    const openForgot = () => {
        setIsLoginOpen(false);
        setIsForgotOpen(true);
    };

    const openLogin = () => {
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
    };

    const openRegister = () => {
        setIsLoginOpen(false);
        setIsRegisterOpen(true);
    };

    const closeAllModals = () => {
        setIsLoginOpen(false);
        setIsRegisterOpen(false);
        setIsForgotOpen(false);
    };

    const handleUserClick = (e) => {
        e.preventDefault();
        if (user) {
            router.push("/account/profile");
        } else {
            openLogin();
        }
    };

    const getAvatarSrc = () => {
        if (!user?.avatar) {
            return "https://popeyes.vn/assets/img/rewards/reward.svg";
        }
        if (user.avatar.startsWith("/uploads")) {
            const apiUrl =
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
            const baseUrl = apiUrl.replace("/api", "");
            return `${baseUrl}${user.avatar}`;
        }
        return user.avatar;
    };

    const canAccessAdmin =
        user && (user.role === "admin" || user.role === "staff");

    return (
        <>
            <header className="bg-[#f48120] text-white sticky top-0 z-[999] shadow-md">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex-shrink-0 cursor-pointer">
                        <Link href="/">
                            <h1 className="text-xl md:text-3xl font-black uppercase tracking-tighter leading-none text-center">
                                <Image
                                    src="/images/crispc_logo.png"
                                    alt="Crispc Logo"
                                    width={150}
                                    height={44}
                                    priority
                                    className="object-contain"
                                />
                            </h1>
                        </Link>
                    </div>

                    <nav className="hidden md:flex space-x-8 font-bold text-lg uppercase">
                        <Link
                            href="/promotion"
                            className="hover:text-yellow-100 transition"
                        >
                            Khuyến mãi
                        </Link>
                        <Link
                            href="/menu"
                            className="hover:text-yellow-100 transition"
                        >
                            Thực đơn
                        </Link>
                        <Link
                            href="/store"
                            className="hover:text-yellow-100 transition"
                        >
                            Cửa hàng
                        </Link>
                        <Link
                            href="/tracking"
                            className="hover:text-yellow-100 transition"
                        >
                            Theo dõi đơn hàng
                        </Link>
                    </nav>

                    <div className="hidden md:flex items-center space-x-6">
                        {canAccessAdmin && (
                            <Link
                                href="/admin"
                                className="flex items-center gap-1 bg-white text-[#f48120] px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:bg-orange-50 transition"
                            >
                                <LayoutDashboard size={18} />
                                QUẢN LÝ
                            </Link>
                        )}

                        <div className="flex items-center space-x-1 cursor-pointer font-bold text-sm">
                            <span>VIE</span>
                            <ChevronDown size={14} />
                        </div>

                        <div
                            onClick={handleUserClick}
                            className="flex flex-col items-center justify-center hover:opacity-80 cursor-pointer"
                        >
                            {!user ? (
                                <User size={26} strokeWidth={2.5} />
                            ) : user.avatar ? (
                                <img
                                    src={getAvatarSrc()}
                                    alt="Avatar"
                                    className="w-[26px] h-[26px] rounded-full object-cover border-2 border-white"
                                />
                            ) : (
                                <div className="w-[26px] h-[26px] rounded-full bg-white text-[#f48120] border-2 border-white flex items-center justify-center text-xs font-extrabold shadow-sm">
                                    {getUserInitial()}
                                </div>
                            )}
                        </div>

                        <Link
                            href="/cart"
                            className="relative cursor-pointer hover:opacity-80"
                        >
                            <ShoppingBasket size={24} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-white text-[#f48120] text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center animate-in zoom-in">
                                    {cartCount > 99 ? "99+" : cartCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    <div className="flex md:hidden items-center space-x-5 px-3">
                        {canAccessAdmin && (
                            <Link
                                href="/admin"
                                className="flex flex-col items-center justify-center hover:opacity-80 text-white"
                            >
                                <LayoutDashboard size={26} strokeWidth={2.5} />
                            </Link>
                        )}

                        <Link
                            href="/menu"
                            className="flex flex-col items-center justify-center hover:opacity-80"
                        >
                            <FileText size={26} strokeWidth={2.5} />
                        </Link>
                        <Link
                            href="/promotion"
                            className="flex flex-col items-center justify-center hover:opacity-80"
                        >
                            <BadgePercent size={26} strokeWidth={2.5} />
                        </Link>

                        <Link
                            href="/cart"
                            className="flex flex-col items-center justify-center hover:opacity-80 relative"
                        >
                            <ShoppingBasket size={26} strokeWidth={2.5} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-white text-[#f48120] text-[10px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center animate-in zoom-in">
                                    {cartCount > 99 ? "99+" : cartCount}
                                </span>
                            )}
                        </Link>

                        <div
                            onClick={handleUserClick}
                            className="flex flex-col items-center justify-center hover:opacity-80 cursor-pointer"
                        >
                            {user?.avatar ? (
                                <img
                                    src={getAvatarSrc()}
                                    alt="Avatar"
                                    className="w-[26px] h-[26px] rounded-full object-cover border-2 border-white"
                                />
                            ) : (
                                <User size={26} strokeWidth={2.5} />
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={closeAllModals}
                onSwitchToRegister={openRegister}
                onOpenForgot={openForgot}
            />
            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={closeAllModals}
                onSwitchToLogin={openLogin}
            />
            <ForgotPasswordModal
                isOpen={isForgotOpen}
                onClose={closeAllModals}
            />
        </>
    );
};

export default Header;
