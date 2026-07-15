"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, Pencil, X, Star, Home } from "lucide-react";
import Cookies from "js-cookie";
import useAuthStore from "@/stores/useAuthStore";
import { AddressService } from "@/services/addressService";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [userAddresses, setUserAddresses] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [savedAddress, setSavedAddress] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const { user } = useAuthStore();
    const wrapperRef = useRef(null);

    useEffect(() => {
        const cookieAddress = Cookies.get("delivery_address");
        if (cookieAddress) {
            setSavedAddress(cookieAddress);
            setQuery(cookieAddress);
        }

        const fetchUserAddresses = async () => {
            if (user) {
                try {
                    const res = await AddressService.getList();
                    if (res && res.data) {
                        const sorted = res.data.sort(
                            (a, b) => b.is_default - a.is_default
                        );
                        setUserAddresses(sorted);
                    }
                } catch (error) {
                    console.error("Lỗi tải sổ địa chỉ:", error);
                }
            }
        };
        fetchUserAddresses();
    }, [user]);

    useEffect(() => {
        if (!isEditing && savedAddress) return;

        const delayDebounceFn = setTimeout(async () => {
            if (query.length > 2) {
                setIsLoading(true);
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                            query
                        )}&addressdetails=1&limit=5&countrycodes=vn`
                    );
                    const data = await response.json();
                    setSuggestions(data);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Lỗi tìm địa chỉ:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSuggestions([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query, isEditing, savedAddress]);

    const handleInputFocus = () => {
        setShowSuggestions(true);
    };

    const handleInputBlur = () => {
        setTimeout(() => {
            setShowSuggestions(false);
        }, 200);
    };

    const handleSelectAddress = (fullAddress) => {
        setQuery(fullAddress);
        setSavedAddress(fullAddress);
        setShowSuggestions(false);
        setIsEditing(false);
        Cookies.set("delivery_address", fullAddress, { expires: 7 });
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setShowSuggestions(true);
    };

    const handleCancelEdit = () => {
        if (savedAddress) {
            setQuery(savedAddress);
            setIsEditing(false);
            setShowSuggestions(false);
        }
    };

    const getAddressIcon = (addr) => {
        if (addr.is_default)
            return (
                <Star size={18} className="text-yellow-500 fill-yellow-500" />
            );
        return <Home size={18} className="text-blue-500" />;
    };

    return (
        <div className="bg-transparent relative z-30 pb-4" ref={wrapperRef}>
            <div className="container mx-auto max-w-[800px]">
                <div className="relative w-full">
                    {savedAddress && !isEditing ? (
                        <div className="flex items-center bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden h-10 md:h-12 px-4 animate-in fade-in zoom-in-95 duration-300">
                            <MapPin
                                className="text-[#f48120] flex-shrink-0 mr-3"
                                size={20}
                            />
                            <span className="flex-grow text-gray-800 font-medium truncate mr-4">
                                {savedAddress}
                            </span>
                            <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>
                            <button
                                onClick={handleEditClick}
                                className="text-sm font-bold text-[#f48120] hover:text-[#d96e17] flex items-center gap-1 whitespace-nowrap px-2 py-1 rounded-md hover:bg-orange-50 transition"
                            >
                                <Pencil size={14} /> Sửa
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="flex items-center bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden h-10 md:h-12">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputBlur}
                                    placeholder="Nhập địa chỉ giao hàng..."
                                    className="flex-grow px-6 md:px-8 h-full outline-none text-gray-600 placeholder-gray-400 text-sm md:text-base w-full"
                                    autoFocus={isEditing}
                                />

                                {isEditing && savedAddress ? (
                                    <button
                                        onClick={handleCancelEdit}
                                        className="h-full w-14 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-gray-50 border-l border-gray-100"
                                    >
                                        <X size={20} />
                                    </button>
                                ) : (
                                    <button className="bg-[#f48120] h-full w-14 md:w-16 flex flex-shrink-0 items-center justify-center hover:bg-[#d96e17]">
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
                                    </button>
                                )}
                            </div>

                            {showSuggestions && (
                                <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-2xl mt-2 border border-gray-100 overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-200 max-h-[300px] overflow-y-auto custom-scrollbar">
                                    <ul>
                                        {query.length > 0 &&
                                            suggestions.map((item) => (
                                                <li
                                                    key={item.place_id}
                                                    onMouseDown={() =>
                                                        handleSelectAddress(
                                                            item.display_name
                                                        )
                                                    }
                                                    className="flex items-start px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 group"
                                                >
                                                    <MapPin
                                                        size={20}
                                                        className="text-gray-400 mr-3 mt-0.5 flex-shrink-0 group-hover:text-[#f48120]"
                                                    />
                                                    <span className="text-gray-600 text-sm font-medium line-clamp-2 group-hover:text-gray-900">
                                                        {item.display_name}
                                                    </span>
                                                </li>
                                            ))}

                                        {query.length === 0 &&
                                            userAddresses.length > 0 && (
                                                <>
                                                    <li className="px-4 py-2 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                                                        Địa chỉ của bạn
                                                    </li>
                                                    {userAddresses.map(
                                                        (addr) => (
                                                            <li
                                                                key={addr.id}
                                                                onMouseDown={() =>
                                                                    handleSelectAddress(
                                                                        addr.full_address
                                                                    )
                                                                }
                                                                className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-0 group"
                                                            >
                                                                <div className="mr-3 mt-0.5 flex-shrink-0">
                                                                    {getAddressIcon(
                                                                        addr
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col text-left">
                                                                    <span className="text-gray-800 text-sm font-bold flex items-center gap-2">
                                                                        {addr.address_name ||
                                                                            "Nhà riêng"}
                                                                        {addr.is_default ===
                                                                            1 && (
                                                                            <span className="bg-yellow-100 text-yellow-700 text-[10px] px-1.5 py-0.5 rounded border border-yellow-200 font-bold">
                                                                                Mặc
                                                                                định
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                    <span className="text-gray-500 text-xs line-clamp-1 group-hover:text-[#f48120]">
                                                                        {
                                                                            addr.full_address
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </li>
                                                        )
                                                    )}
                                                </>
                                            )}

                                        {query.length > 0 &&
                                            suggestions.length === 0 &&
                                            !isLoading && (
                                                <li className="px-4 py-4 text-center text-gray-500 text-sm">
                                                    Không tìm thấy địa chỉ phù
                                                    hợp.
                                                </li>
                                            )}

                                        {query.length === 0 &&
                                            userAddresses.length === 0 && (
                                                <li className="px-4 py-4 text-center text-gray-400 text-sm italic">
                                                    Nhập tên đường, phường, quận
                                                    để tìm kiếm...
                                                </li>
                                            )}
                                    </ul>

                                    {query.length > 0 && (
                                        <div className="bg-gray-50 px-4 py-1 text-[10px] text-gray-400 text-right">
                                            Powered by OpenStreetMap
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
