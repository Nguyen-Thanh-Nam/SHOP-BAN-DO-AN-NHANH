"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PromotionService } from "@/services/promotionService";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

const PromotionPage = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const getImageUrl = (path) => {
        if (!path) return "https://placehold.co/400x400?text=No+Image";
        return path.startsWith("/uploads")
            ? `${process.env.NEXT_PUBLIC_API_URL.replace("/api", "")}${path}`
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
            setLoading(true);
            try {
                const res = await PromotionService.getAll();

                const mappedData = res.data.map((item) => {
                    const isAvailable = checkAvailability(item.valid_days);
                    return {
                        id: item.id,
                        title: item.name,
                        image: getImageUrl(item.image || item.thumbnail),
                        isAvailable: isAvailable,
                        buttonText: isAvailable
                            ? "Đặt ngay"
                            : "Không khả dụng hôm nay",
                        slug: item.slug,
                    };
                });

                setPromotions(mappedData);
            } catch (error) {
                console.error("Lỗi tải khuyến mãi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalPages = Math.ceil(promotions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = promotions.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="animate-spin text-[#f48120]" size={40} />
            </div>
        );
    }

    return (
        <div className=" bg-white">
            <div className="bg-white py-10 border-t border-gray-100">
                <div className="container mx-auto px-4 max-w-6xl">
                    {promotions.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            Hiện chưa có chương trình khuyến mãi nào.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {currentData.map((promo) => (
                                <div
                                    key={promo.id}
                                    className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group"
                                >
                                    <Link
                                        href={`/promotion/${promo.slug}`}
                                        className="relative aspect-square w-full block overflow-hidden"
                                    >
                                        <Image
                                            unoptimized={true}
                                            src={promo.image}
                                            alt={promo.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>

                                    <div className="p-4 flex flex-col flex-grow items-center text-center">
                                        <Link
                                            href={`/promotion/${promo.slug}`}
                                            className="hover:text-[#f48120] transition-colors"
                                        >
                                            <h3 className="text-gray-700 font-bold text-xs md:text-sm uppercase mb-4 leading-relaxed line-clamp-2 min-h-[40px]">
                                                {promo.title}
                                            </h3>
                                        </Link>

                                        <div className="mt-auto w-full">
                                            {promo.isAvailable ? (
                                                <Link
                                                    href={`/promotion/${promo.slug}`}
                                                    className="block w-full"
                                                >
                                                    <button className="w-full bg-[#f48120] hover:bg-[#d96e17] text-white text-xs md:text-sm font-bold py-2 rounded-full transition uppercase shadow-sm">
                                                        {promo.buttonText}
                                                    </button>
                                                </Link>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="w-full bg-[#b0b0b0] text-white text-[10px] md:text-xs font-bold py-2 rounded-full cursor-not-allowed uppercase"
                                                >
                                                    {promo.buttonText}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2">
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition"
                            >
                                <ChevronLeft size={16} strokeWidth={3} />
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1
                            ).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-8 h-8 rounded-full text-xs font-bold transition flex items-center justify-center ${
                                        currentPage === page
                                            ? "bg-[#f48120] text-white shadow-md"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                                className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition"
                            >
                                <ChevronRight size={16} strokeWidth={3} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PromotionPage;
