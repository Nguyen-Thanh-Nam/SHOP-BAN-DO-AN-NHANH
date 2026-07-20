"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductDetailModal from "../shared/ProductDetailModal";
import ProductGrid from "../shared/ProductGrid";
import { ProductService } from "@/services/productService";
import { PromotionService } from "@/services/promotionService";
import Link from "next/link";

const ProductSection = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("menu");
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [products, setProducts] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);

    const getImageUrl = (path) => {
        if (!path) return "https://placehold.co/300x300?text=No+Image";
        return path.startsWith("/uploads")
            ? `${(process.env.NEXT_PUBLIC_API_URL || "").replace("/api", "")}${path}`
            : path;
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (activeTab === "menu") {
                    const res = await ProductService.getProducts({
                        category_slug: "best-seller",
                        limit: 4,
                    });

                    const mappedProducts = res.data.map((item) => ({
                        id: item.id,
                        title: item.name,
                        price: `${parseInt(item.price).toLocaleString(
                            "vi-VN"
                        )} ₫`,
                        image: getImageUrl(item.image),
                        description: item.description,
                        original_price: item.original_price,
                        option_groups: item.option_groups,
                    }));
                    setProducts(mappedProducts);
                } else {
                    const res = await PromotionService.getAll({ limit: 4 });

                    const mappedPromos = res.data.map((item) => ({
                        id: item.id,
                        title: item.name,
                        image: getImageUrl(item.image || item.thumbnail),
                        isAvailable: item.is_active === 1,
                        buttonText: item.is_active
                            ? "Đặt ngay"
                            : "Không khả dụng hôm nay",
                        slug: item.slug,
                    }));
                    setPromotions(mappedPromos);
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    const handleItemClick = (item) => {
        if (activeTab === "menu") {
            setSelectedProduct(item);
        } else {
            if (item.slug) {
                router.push(`/promotion/${item.slug}`);
            }
        }
    };

    return (
        <div className="bg-white py-2 pb-10">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex justify-center space-x-12 mb-10">
                    <div
                        onClick={() => setActiveTab("menu")}
                        className={`pb-2 border-b-2 cursor-pointer transition-colors ${
                            activeTab === "menu"
                                ? "border-[#f48120]"
                                : "border-transparent hover:border-gray-200"
                        }`}
                    >
                        <h3
                            className={`${
                                activeTab === "menu"
                                    ? "text-[#f48120]"
                                    : "text-gray-400"
                            } font-bold text-lg uppercase tracking-wide`}
                        >
                            Món ngon phải thử
                        </h3>
                    </div>
                    <div
                        onClick={() => setActiveTab("promo")}
                        className={`pb-2 border-b-2 cursor-pointer transition-colors ${
                            activeTab === "promo"
                                ? "border-[#f48120]"
                                : "border-transparent hover:border-gray-200"
                        }`}
                    >
                        <h3
                            className={`${
                                activeTab === "promo"
                                    ? "text-[#f48120]"
                                    : "text-gray-400"
                            } font-bold text-lg uppercase tracking-wide`}
                        >
                            Khuyến mãi
                        </h3>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-64 bg-gray-100 rounded-lg animate-pulse"
                            ></div>
                        ))}
                    </div>
                ) : (
                    <>
                        <ProductGrid
                            items={activeTab === "menu" ? products : promotions}
                            type={activeTab}
                            onItemClick={handleItemClick}
                        />
                        <div className="flex justify-center">
                            <Link
                                href={
                                    activeTab === "menu"
                                        ? "/menu"
                                        : "/promotion"
                                }
                                className="bg-[#009895] text-white font-bold py-3 px-10 rounded-full shadow-md hover:bg-[#008582] transition duration-300 text-sm inline-block"
                            >
                                {activeTab === "menu"
                                    ? "Xem thêm thực đơn"
                                    : "Xem thêm khuyến mãi"}
                            </Link>
                        </div>
                    </>
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

export default ProductSection;
