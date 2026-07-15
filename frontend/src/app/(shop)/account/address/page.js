"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    LogOut,
    ChevronLeft,
    Pencil,
    X,
    Search,
    MapPin,
    Loader2,
    User,
    Ticket,
    ShoppingBag,
} from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";
import useAddressStore from "@/stores/useAddressStore";
import { toast } from "react-toastify";

const AddressSearchInput = ({ onSelectAddress, defaultValue }) => {
    const [query, setQuery] = useState(defaultValue || "");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setQuery(defaultValue || "");
    }, [defaultValue]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length > 2 && showSuggestions) {
                setIsLoading(true);
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                            query
                        )}&addressdetails=1&limit=5&countrycodes=vn`
                    );
                    const data = await response.json();
                    setSuggestions(data);
                } catch (error) {
                    console.error("Lỗi tìm địa chỉ:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query, showSuggestions]);

    const handleSelect = (address) => {
        setQuery(address.display_name);
        setSuggestions([]);
        setShowSuggestions(false);
        onSelectAddress(address.display_name);
    };

    return (
        <div className="relative w-full">
            <label className="block text-sm font-bold text-gray-800 mb-2">
                Địa chỉ*
            </label>
            <div className="flex items-center bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden h-10 md:h-12">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                        onSelectAddress(e.target.value);
                    }}
                    placeholder="Nhập địa chỉ (Phường, Quận...)"
                    className="flex-grow px-6 md:px-8 h-full outline-none text-gray-600 placeholder-gray-400 text-sm md:text-base w-full"
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 200)
                    }
                />
                <div className="bg-[#f48120] h-full w-14 md:w-16 flex flex-shrink-0 items-center justify-center">
                    {isLoading ? (
                        <Loader2
                            className="text-white animate-spin"
                            size={20}
                        />
                    ) : (
                        <Search
                            className="text-white"
                            size={20}
                            strokeWidth={3}
                        />
                    )}
                </div>
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-2xl mt-2 border border-gray-100 overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-200">
                    <ul>
                        {suggestions.map((item) => (
                            <li
                                key={item.place_id}
                                onClick={() => handleSelect(item)}
                                className="flex items-start px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                            >
                                <MapPin
                                    size={20}
                                    className="text-gray-500 mr-3 mt-0.5 flex-shrink-0"
                                />
                                <span className="text-gray-600 text-sm font-medium line-clamp-2 text-left">
                                    {item.display_name}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="bg-gray-50 px-4 py-1 text-[10px] text-gray-400 text-right">
                        OSM API
                    </div>
                </div>
            )}
        </div>
    );
};

const AddressPage = () => {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const {
        addresses,
        fetchAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefault,
        isLoading,
    } = useAddressStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        full_address: "",
        address_name: "",
        recipient_name: "",
        recipient_email: "",
        recipient_phone: "",
        is_default: false,
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData({
            full_address: "",
            address_name: "",
            recipient_name: "",
            recipient_email: "",
            recipient_phone: "",
            is_default: false,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (addr) => {
        setEditingId(addr.id);
        setFormData({
            full_address: addr.full_address,
            address_name: addr.address_name,
            recipient_name: addr.recipient_name,
            recipient_email: addr.recipient_email || "",
            recipient_phone: addr.recipient_phone,
            is_default: addr.is_default === 1 || addr.is_default === true,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.full_address) {
            toast.info("Vui lòng nhập địa chỉ");
            return;
        }

        let result;
        if (editingId) {
            result = await updateAddress(editingId, formData);
        } else {
            result = await addAddress(formData);
        }

        if (result.success) {
            setIsModalOpen(false);
        } else {
            toast.info(result.error);
        }
    };

    const handleChange = (e) => {
        const value =
            e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            <div className="container mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-3/4">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-xl font-bold">
                                Sổ địa chỉ của bạn
                            </h1>
                            <button
                                onClick={openAddModal}
                                className="bg-[#f48120] hover:bg-[#d96e17] text-white px-4 py-2 rounded-full font-bold text-sm flex items-center transition"
                            >
                                Thêm địa chỉ mới
                            </button>
                        </div>

                        <div className="space-y-4">
                            {addresses.length === 0 && (
                                <p className="text-gray-500">
                                    Bạn chưa có địa chỉ nào.
                                </p>
                            )}

                            {addresses.map((addr) => (
                                <div
                                    key={addr.id}
                                    className="border-t border-gray-100 py-6 first:border-t-0"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2 w-full">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-gray-900">
                                                    {addr.recipient_name}
                                                </span>
                                                {(addr.is_default === 1 ||
                                                    addr.is_default ===
                                                        true) && (
                                                    <span className="bg-[#00bfa5] text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                                                        Mặc định
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-[100px_1fr] gap-y-1 text-sm text-gray-600">
                                                <span>Họ tên</span>
                                                <span className="text-gray-900 font-medium">
                                                    {addr.recipient_name}
                                                </span>
                                                <span>Số điện thoại</span>
                                                <span className="text-gray-900 font-medium">
                                                    {addr.recipient_phone}
                                                </span>
                                                <span>Địa chỉ</span>
                                                <span className="text-gray-900">
                                                    {addr.full_address}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-4 min-w-[120px]">
                                            <button
                                                onClick={() =>
                                                    openEditModal(addr)
                                                }
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setDefault(addr.id)
                                                }
                                                disabled={addr.is_default}
                                                className={`text-xs px-3 py-1.5 rounded-full border transition font-medium
                                                    ${
                                                        addr.is_default
                                                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-default"
                                                            : "bg-white text-gray-500 border-gray-300 hover:border-[#f48120] hover:text-[#f48120]"
                                                    }`}
                                            >
                                                Đặt làm mặc định
                                            </button>
                                            {!addr.is_default && (
                                                <button
                                                    onClick={() =>
                                                        deleteAddress(addr.id)
                                                    }
                                                    className="text-xs text-red-500 hover:underline"
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full md:w-1/4 border-l border-gray-100 md:pl-0">
                        <div className="flex flex-col sticky top-24 bg-white rounded-xl">
                            <Link
                                href="/account/profile"
                                className="py-4 px-4 border-b border-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-3"
                            >
                                <User size={18} /> Thông tin tài khoản
                            </Link>

                            <Link
                                href="/account/vouchers"
                                className="py-4 px-4 border-b border-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-3"
                            >
                                <Ticket size={18} /> Ưu đãi của tôi
                            </Link>

                            <Link
                                href="/account/orders"
                                className="py-4 px-4 border-b border-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-3"
                            >
                                <ShoppingBag size={18} /> Lịch sử đơn hàng
                            </Link>

                            <Link
                                href="/account/address"
                                className="py-4 px-4 bg-orange-50 border-l-4 border-[#f48120] text-sm font-bold text-[#f48120] transition flex items-center gap-3"
                            >
                                <MapPin size={18} /> Địa chỉ giao hàng
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

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-[500px] overflow-visible animate-in zoom-in-95 duration-200">
                        <div className="p-6 pb-0 relative">
                            <h2 className="text-[#f48120] text-2xl font-bold text-center">
                                {editingId
                                    ? "Cập nhật địa chỉ"
                                    : "Thêm địa chỉ mới"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 pt-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <AddressSearchInput
                                    defaultValue={formData.full_address}
                                    onSelectAddress={(val) =>
                                        setFormData({
                                            ...formData,
                                            full_address: val,
                                        })
                                    }
                                />

                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">
                                        Tên địa chỉ
                                    </label>
                                    <input
                                        type="text"
                                        name="address_name"
                                        value={formData.address_name}
                                        onChange={handleChange}
                                        placeholder="Vd: Nhà, Công ty, Trường học..."
                                        className="w-full border-b border-gray-200 pb-2 outline-none focus:border-[#f48120] transition placeholder-gray-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">
                                        Họ tên
                                    </label>
                                    <input
                                        type="text"
                                        name="recipient_name"
                                        value={formData.recipient_name}
                                        onChange={handleChange}
                                        placeholder="Nhập tên người nhận"
                                        className="w-full border-b border-gray-200 pb-2 outline-none focus:border-[#f48120] transition placeholder-gray-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="recipient_email"
                                        value={formData.recipient_email}
                                        onChange={handleChange}
                                        placeholder="Nhập email"
                                        className="w-full border-b border-gray-200 pb-2 outline-none focus:border-[#f48120] transition placeholder-gray-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        name="recipient_phone"
                                        value={formData.recipient_phone}
                                        onChange={handleChange}
                                        placeholder="Nhập số điện thoại người nhận"
                                        className="w-full border-b border-gray-200 pb-2 outline-none focus:border-[#f48120] transition placeholder-gray-400"
                                    />
                                </div>

                                <div className="flex items-center pt-2">
                                    <input
                                        type="checkbox"
                                        id="is_default"
                                        name="is_default"
                                        checked={formData.is_default}
                                        onChange={handleChange}
                                        className="w-5 h-5 border-2 border-gray-400 rounded text-[#f48120] focus:ring-[#f48120] mr-3"
                                    />
                                    <label
                                        htmlFor="is_default"
                                        className="text-gray-700 font-medium select-none cursor-pointer"
                                    >
                                        Đặt làm mặc định
                                    </label>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-[#f48120] hover:bg-[#d96e17] text-white font-bold py-3 rounded-full transition shadow-md uppercase disabled:bg-gray-300"
                                    >
                                        {isLoading
                                            ? "ĐANG XỬ LÝ..."
                                            : editingId
                                            ? "CẬP NHẬT"
                                            : "THÊM ĐỊA CHỈ"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressPage;
