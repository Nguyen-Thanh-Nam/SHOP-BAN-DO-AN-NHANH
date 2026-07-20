"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PromotionService } from "@/services/promotionService";
import ProductDetailModal from "@/components/shared/ProductDetailModal";

const PromotionDetailPage = () => {
    const { slug } = useParams();
    const [promotion, setPromotion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isAvailable, setIsAvailable] = useState(true);

    const getImageUrl = (path) => {
        if (!path) return "https://placehold.co/600x400?text=No+Image";
        return path.startsWith("/uploads")
            ? `${(process.env.NEXT_PUBLIC_API_URL || "").replace("/api", "")}${path}`
            : path;
    };

    const checkAvailability = (validDaysStr) => {
        if (!validDaysStr || validDaysStr === "All") return true;
        const jsDay = new Date().getDay();
        const currentDay = jsDay === 0 ? "1" : (jsDay + 1).toString();
        const validDays = validDaysStr.split(",");
        return validDays.includes(currentDay);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await PromotionService.getDetail(slug);
                setPromotion(res.data);

                if (res.data) {
                    setIsAvailable(checkAvailability(res.data.valid_days));
                }
            } catch (error) {
                console.error("Lỗi tải khuyến mãi:", error);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchData();
    }, [slug]);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="animate-spin text-[#f48120]" size={40} />
            </div>
        );

    if (!promotion)
        return (
            <div className="text-center py-20">
                Không tìm thấy chương trình.
            </div>
        );

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 max-w-6xl py-8 md:py-12">
                <div className="flex flex-col md:flex-row gap-8 mb-16">
                    <div className="w-full md:w-1/2">
                        <div className="relative aspect-square md:aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            <Image
                                src={getImageUrl(
                                    promotion.image || promotion.banner
                                )}
                                alt={promotion.name}
                                fill
                                className="object-cover"
                                priority
                                unoptimized={true}
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 uppercase leading-tight">
                            {promotion.name}
                        </h1>
                        <div
                            className="prose prose-orange text-gray-600 text-sm md:text-base leading-relaxed"
                            dangerouslySetInnerHTML={{
                                __html: promotion.description,
                            }}
                        />
                        <div className="mt-6 space-y-2 text-xs text-gray-500 italic border-t border-gray-100 pt-4">
                            {!isAvailable && (
                                <p className="text-red-500 font-bold">
                                    (*) Chương trình này không áp dụng vào ngày
                                    hôm nay.
                                </p>
                            )}
                            <p>
                                (*) Áp dụng khi đặt giao hàng qua Hotline 1900
                                6008 hoặc Website.
                            </p>
                        </div>
                    </div>
                </div>

                {promotion.products && promotion.products.length > 0 && (
                    <div className="border-t border-gray-100 pt-10">
                        <h2 className="text-center text-xl md:text-2xl font-bold text-[#f48120] mb-8 uppercase">
                            Các sản phẩm trong chương trình khuyến mãi
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {promotion.products.map((prod) => (
                                <div
                                    key={prod.id}
                                    onClick={() =>
                                        isAvailable && setSelectedProduct(prod)
                                    }
                                    className={`
                                        group bg-white rounded-[32px] overflow-hidden border border-gray-100 flex flex-col h-full
                                        transition duration-300
                                        ${
                                            isAvailable
                                                ? "cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)]"
                                                : "cursor-not-allowed opacity-99 grayscale pointer-events-none"
                                        }
                                    `}
                                >
                                    <div className="relative aspect-square w-full bg-[#fdf6f0]">
                                        <Image
                                            unoptimized={true}
                                            src={getImageUrl(prod.image)}
                                            alt={prod.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition duration-500"
                                        />
                                    </div>

                                    <div className="p-5 flex flex-col items-center flex-grow text-center">
                                        <h4 className="font-bold text-[#f48120] text-[15px] leading-snug line-clamp-2 mb-3 min-h-[42px]">
                                            {prod.name}
                                        </h4>

                                        <div className="mt-auto w-full">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[#002b5c] font-bold text-lg">
                                                    {parseInt(
                                                        prod.price
                                                    ).toLocaleString(
                                                        "vi-VN"
                                                    )}{" "}
                                                    ₫
                                                </span>
                                                {prod.original_price >
                                                    prod.price && (
                                                    <span className="text-xs text-gray-400 line-through">
                                                        {parseInt(
                                                            prod.original_price
                                                        ).toLocaleString(
                                                            "vi-VN"
                                                        )}{" "}
                                                        ₫
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <ProductDetailModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                product={selectedProduct}
            />
        </div>
    );
};

export default PromotionDetailPage;
