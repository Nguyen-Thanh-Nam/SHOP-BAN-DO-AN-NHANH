"use client";

import React, { useState, useEffect } from "react";
import CategoryNav from "@/components/menu/CategoryNav";
import ProductGrid from "@/components/shared/ProductGrid";
import ProductDetailModal from "@/components/shared/ProductDetailModal";
import SearchModal from "@/components/shared/SearchModal";
import SearchBar from "@/components/shared/SearchBar";
import { ProductService } from "@/services/productService";
import { CategoryService } from "@/services/categoryService";
import { Loader2 } from "lucide-react";

const MenuPage = () => {
    const [activeCategory, setActiveCategory] = useState("all");
    const [categories, setCategories] = useState([]);
    const [homeSections, setHomeSections] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const getImageUrl = (path) => {
        if (!path) return "https://placehold.co/400x400?text=No+Image";
        return path.startsWith("/uploads")
            ? `${(process.env.NEXT_PUBLIC_API_URL || "").replace("/api", "")}${path}`
            : path;
    };

    const mapProductData = (data) => {
        return data.map((item) => ({
            id: item.id,
            title: item.name,
            price: `${parseInt(item.price).toLocaleString("vi-VN")} ₫`,
            image: getImageUrl(item.image),
            description: item.description,
            original_price: item.original_price,
            option_groups: item.option_groups,
        }));
    };

    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            try {
                const catsRes = await CategoryService.getAll();
                const allCats = catsRes.data || [];
                const activeCats = allCats.filter((cat) => cat.is_active !== 0);

                setCategories(activeCats);

                const sectionsData = await Promise.all(
                    activeCats.map(async (cat) => {
                        const res = await ProductService.getProducts({
                            category_slug: cat.slug,
                            limit: 4,
                        });
                        return {
                            id: cat.id,
                            title: cat.name,
                            slug: cat.slug,
                            items: mapProductData(res.data),
                        };
                    })
                );

                setHomeSections(
                    sectionsData.filter((section) => section.items.length > 0)
                );
            } catch (error) {
                console.error("Lỗi tải Menu:", error);
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, []);

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            if (activeCategory === "all") return;

            setLoading(true);
            window.scrollTo({ top: 0, behavior: "smooth" });

            try {
                const res = await ProductService.getProducts({
                    category_slug: activeCategory,
                });
                setCategoryProducts(mapProductData(res.data));
            } catch (error) {
                console.error("Lỗi tải sản phẩm danh mục:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();
    }, [activeCategory]);

    const handleSeeAll = (slug) => {
        setActiveCategory(slug);
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            <CategoryNav
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                onSearchClick={() => setIsSearchOpen(true)}
            />

            <div className="pt-5">
                <SearchBar />
            </div>

            <div className="container mx-auto px-4 max-w-6xl mt-8">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2
                            className="animate-spin text-[#f48120]"
                            size={40}
                        />
                    </div>
                ) : (
                    <>
                        {activeCategory === "all" ? (
                            <>
                                {homeSections.map((section) => (
                                    <div
                                        key={section.id}
                                        className="mb-12 border-b border-gray-50 pb-8 last:border-0"
                                    >
                                        <div className="text-center mb-8 px-2 w-full">
                                            <h3 className="text-[#f48120] font-bold text-xl md:text-2xl uppercase inline-block border-b-2 border-transparent pb-1">
                                                {section.title}
                                            </h3>
                                        </div>
                                        <ProductGrid
                                            items={section.items}
                                            type="menu"
                                            onItemClick={setSelectedProduct}
                                        />
                                        <div className="flex justify-center mt-8">
                                            <button
                                                onClick={() =>
                                                    handleSeeAll(section.slug)
                                                }
                                                className="bg-[#009895] text-white font-bold py-3 px-10 rounded-full shadow-md hover:bg-[#008582] transition duration-300 text-sm inline-block"
                                            >
                                                Xem thêm thực đơn
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="mb-12">
                                <h3 className="text-center text-[#f48120] font-bold text-xl md:text-2xl mb-8 uppercase">
                                    {categories.find(
                                        (c) => c.slug === activeCategory
                                    )?.name || "Danh sách món"}
                                </h3>
                                {categoryProducts.length > 0 ? (
                                    <ProductGrid
                                        items={categoryProducts}
                                        type="menu"
                                        onItemClick={setSelectedProduct}
                                    />
                                ) : (
                                    <div className="text-center text-gray-500 py-10 flex flex-col items-center">
                                        <p>
                                            Chưa có món ăn nào trong danh mục
                                            này.
                                        </p>
                                        <button
                                            onClick={() =>
                                                setActiveCategory("all")
                                            }
                                            className="mt-4 text-[#f48120] font-bold hover:underline"
                                        >
                                            Quay lại thực đơn
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSelectProduct={(product) => {
                    const mappedProduct = mapProductData([product])[0];
                    setSelectedProduct(mappedProduct);
                }}
            />

            <ProductDetailModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                product={selectedProduct}
            />
        </div>
    );
};

export default MenuPage;
