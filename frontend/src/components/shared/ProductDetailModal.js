"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Minus, Plus, Loader2 } from "lucide-react";
import { ProductService } from "@/services/productService";
import useCartStore from "@/stores/useCartStore";
import { toast } from "react-toastify";

const ProductDetailModal = ({ isOpen, onClose, product: initialProduct }) => {
    const [fullProduct, setFullProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    const [selectedOptions, setSelectedOptions] = useState({});
    const [quantity, setQuantity] = useState(1);

    const addToCart = useCartStore((state) => state.addToCart);

    const getImageUrl = (path) => {
        if (!path) return "https://placehold.co/400x400?text=No+Image";
        return path.startsWith("/uploads")
            ? `${(process.env.NEXT_PUBLIC_API_URL || "").replace("/api", "")}${path}`
            : path;
    };

    useEffect(() => {
        if (isOpen && initialProduct) {
            const fetchDetail = async () => {
                setLoading(true);
                try {
                    const res = await ProductService.getProductDetail(
                        initialProduct.id
                    );
                    const data = res.data;
                    setFullProduct(data);

                    const defaults = {};
                    if (data.option_groups) {
                        data.option_groups.forEach((group) => {
                            const defaultOpt =
                                group.options.find((o) => o.is_default) ||
                                group.options[0];

                            if (defaultOpt) {
                                defaults[group.id] = defaultOpt.id;
                            }
                        });
                    }
                    setSelectedOptions(defaults);
                } catch (error) {
                    console.error("Lỗi tải chi tiết:", error);
                } finally {
                    setLoading(false);
                }
            };

            setQuantity(1);
            fetchDetail();
        } else {
            setFullProduct(null);
        }
    }, [isOpen, initialProduct]);

    const handleOptionChange = (groupId, optionId) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [groupId]: optionId,
        }));
    };

    const calculateTotalPrice = () => {
        if (!fullProduct) return 0;
        let unitPrice = parseFloat(fullProduct.price);

        if (fullProduct.option_groups) {
            fullProduct.option_groups.forEach((group) => {
                const selectedId = selectedOptions[group.id];
                if (selectedId) {
                    const opt = group.options.find((o) => o.id === selectedId);
                    if (opt) unitPrice += parseFloat(opt.price_adjustment);
                }
            });
        }
        return unitPrice * quantity;
    };

    const handleAddToCart = () => {
        if (!fullProduct) return;

        const displayOptions = {};

        let finalUnitPrice = parseFloat(fullProduct.price);

        if (fullProduct.option_groups) {
            fullProduct.option_groups.forEach((group) => {
                const selectedId = selectedOptions[group.id];
                if (selectedId) {
                    const option = group.options.find(
                        (o) => o.id === selectedId
                    );
                    if (option) {
                        displayOptions[group.name] = option.name;
                        finalUnitPrice += parseFloat(option.price_adjustment);
                    }
                }
            });
        }

        const productToAdd = {
            id: fullProduct.id,
            title: fullProduct.name,
            image: getImageUrl(fullProduct.image),
            price: finalUnitPrice,
            original_price: fullProduct.original_price,
        };

        addToCart(productToAdd, quantity, displayOptions);

        onClose();
        toast.info("Đã thêm món vào giỏ hàng!");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 text-gray-400 hover:text-gray-600 bg-white/80 rounded-full p-1 md:bg-transparent"
                >
                    <X size={28} />
                </button>

                <div className="w-full md:w-1/2 bg-[#fdf6f0] flex items-center justify-center p-8">
                    <div className="relative w-full aspect-square max-w-md">
                        <Image
                            src={getImageUrl(
                                fullProduct?.image || initialProduct?.image
                            )}
                            unoptimized={true}
                            alt="Product"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/2 flex flex-col flex-1 min-h-0 bg-white">
                    {loading ? (
                        <div className="flex-grow flex items-center justify-center">
                            <Loader2
                                className="animate-spin text-[#f48120]"
                                size={40}
                            />
                        </div>
                    ) : (
                        <>
                            <div className="flex-grow overflow-y-auto p-4 md:p-8 custom-scrollbar">
                                <h2 className="text-[#f48120] text-xl md:text-2xl font-bold mb-2 pr-8 leading-tight">
                                    {fullProduct?.name}
                                </h2>
                                <p className="text-gray-600 text-sm mb-3 leading-relaxed whitespace-pre-line">
                                    {fullProduct?.description}
                                </p>

                                <div className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-6 flex items-center gap-3">
                                    <span>
                                        {parseInt(
                                            fullProduct?.price || 0
                                        ).toLocaleString("vi-VN")}{" "}
                                        ₫
                                    </span>
                                    {fullProduct?.original_price >
                                        fullProduct?.price && (
                                        <span className="text-gray-400 text-base line-through font-normal">
                                            {parseInt(
                                                fullProduct?.original_price
                                            ).toLocaleString("vi-VN")}{" "}
                                            ₫
                                        </span>
                                    )}
                                </div>

                                {fullProduct?.option_groups?.map((group) => (
                                    <div
                                        key={group.id}
                                        className="mb-6 border-b border-gray-100 pb-4 last:border-0"
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="font-bold text-gray-800">
                                                {group.name}
                                            </h3>
                                            <span className="text-xs text-gray-400 font-medium">
                                                {group.is_required
                                                    ? "Bắt buộc"
                                                    : "Không bắt buộc"}
                                                {", chọn 1"}
                                            </span>
                                        </div>
                                        <div className="space-y-4">
                                            {group.options.map((opt) => (
                                                <label
                                                    key={opt.id}
                                                    className="flex items-center justify-between cursor-pointer group hover:bg-gray-50 p-2 -mx-2 rounded-lg transition"
                                                >
                                                    <span className="text-gray-700 text-sm font-medium">
                                                        {opt.name}{" "}
                                                        {parseFloat(
                                                            opt.price_adjustment
                                                        ) > 0 &&
                                                            `(+${parseInt(
                                                                opt.price_adjustment
                                                            ).toLocaleString()}đ)`}
                                                    </span>
                                                    <div className="relative">
                                                        <input
                                                            type="radio"
                                                            name={`group_${group.id}`}
                                                            className="peer sr-only"
                                                            checked={
                                                                selectedOptions[
                                                                    group.id
                                                                ] === opt.id
                                                            }
                                                            onChange={() =>
                                                                handleOptionChange(
                                                                    group.id,
                                                                    opt.id
                                                                )
                                                            }
                                                        />
                                                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-gray-200 peer-checked:border-[#f48120] peer-checked:bg-[#f48120] transition-all flex items-center justify-center">
                                                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-all"></div>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 p-4 bg-white flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] shrink-0 z-20">
                                <div className="flex items-center bg-gray-100 rounded-lg h-10 md:h-12">
                                    <button
                                        onClick={() =>
                                            setQuantity(
                                                Math.max(1, quantity - 1)
                                            )
                                        }
                                        className="w-8 md:w-10 h-full flex items-center justify-center text-gray-500 hover:text-gray-800 transition"
                                    >
                                        <Minus size={16} strokeWidth={3} />
                                    </button>
                                    <span className="w-8 text-center font-bold text-gray-800 text-sm md:text-base">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() =>
                                            setQuantity(quantity + 1)
                                        }
                                        className="w-8 md:w-10 h-full flex items-center justify-center text-gray-500 hover:text-gray-800 transition"
                                    >
                                        <Plus size={16} strokeWidth={3} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 ml-3 md:ml-4 bg-[#f48120] hover:bg-[#d96e17] text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-full transition shadow-lg text-sm md:text-base h-10 md:h-12 whitespace-nowrap flex justify-between items-center"
                                >
                                    <span>Thêm vào giỏ</span>
                                    <span>
                                        {calculateTotalPrice().toLocaleString(
                                            "vi-VN"
                                        )}{" "}
                                        ₫
                                    </span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;
