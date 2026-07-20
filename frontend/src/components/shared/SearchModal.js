"use client";

import React, { useState, useEffect } from "react";
import { X, Search, Loader2 } from "lucide-react";
import { ProductService } from "@/services/productService";

const SearchModal = ({ isOpen, onClose, onSelectProduct }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim().length > 1) {
                setLoading(true);
                try {
                    const res = await ProductService.search(searchTerm);
                    const list = Array.isArray(res) ? res : res.data || [];
                    setResults(list);
                } catch (error) {
                    console.error("Lỗi tìm kiếm:", error);
                    setResults([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const getImageUrl = (path) => {
        if (!path) return "https://placehold.co/100x100?text=No+Img";
        return path.startsWith("/uploads")
            ? `${(process.env.NEXT_PUBLIC_API_URL || "").replace("/api", "")}${path}`
            : path;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 p-4 pt-20 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                >
                    <X size={24} />
                </button>
                <h2 className="text-center text-xl font-bold text-gray-800 mb-4">
                    Bạn đang thèm gì?
                </h2>

                <div className="flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:border-[#f48120] transition-colors shrink-0">
                    <input
                        type="text"
                        placeholder="Gõ tên món ăn (vd: Gà rán)..."
                        className="flex-grow px-5 py-3 outline-none text-gray-700 placeholder-gray-400 text-base h-12"
                        autoFocus
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="bg-[#f48120] h-12 px-6 flex items-center justify-center text-white hover:bg-[#d96e17] transition">
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <Search size={20} />
                        )}
                    </button>
                </div>

                <div className="mt-4 overflow-y-auto custom-scrollbar flex-1">
                    {loading ? (
                        <div className="text-center py-8 text-gray-400">
                            Đang tìm kiếm...
                        </div>
                    ) : results.length > 0 ? (
                        <div className="space-y-3">
                            {results.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => {
                                        if (onSelectProduct) {
                                            onSelectProduct(product);
                                        }
                                        onClose();
                                    }}
                                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition border border-transparent hover:border-gray-100"
                                >
                                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                        <img
                                            src={getImageUrl(product.image)}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 line-clamp-1">
                                            {product.name}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[#f48120] font-bold text-sm">
                                                {parseInt(
                                                    product.price
                                                ).toLocaleString("vi-VN")}
                                                đ
                                            </span>
                                            {product.original_price >
                                                product.price && (
                                                <span className="text-gray-400 text-xs line-through">
                                                    {parseInt(
                                                        product.original_price
                                                    ).toLocaleString("vi-VN")}
                                                    đ
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : searchTerm.length > 1 ? (
                        <div className="text-center py-8 text-gray-400">
                            Không tìm thấy món nào phù hợp.
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
