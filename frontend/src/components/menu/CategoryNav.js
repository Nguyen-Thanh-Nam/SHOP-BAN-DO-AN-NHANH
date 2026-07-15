"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const getImageUrl = (path) => {
    if (!path)
        return "https://api.popeyes.vn/api/v1/files/06012023_150400_ud.png";
    return path.startsWith("http")
        ? path
        : `${process.env.NEXT_PUBLIC_API_URL.replace("/api", "")}${path}`;
};

function ColorIcon({ src, active, className = "" }) {
    return (
        <span
            aria-hidden="true"
            className={`${className} block w-10 h-10 md:w-14 md:h-14 transition bg-gray-400
                  ${active ? "!bg-[#FF8A00]" : "opacity-50"}`}
            style={{
                WebkitMaskImage: `url(${src})`,
                maskImage: `url(${src})`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
            }}
        />
    );
}

const CategoryNav = ({
    categories = [],
    activeCategory,
    setActiveCategory,
    onSearchClick,
}) => {
    const navItems = [
        {
            key: "all",
            label: "Tất cả",
            img: getImageUrl("/uploads/06012023_151959_yd.png"),
        },
        ...categories
            .filter((cat) => cat.is_active !== 0)
            .map((cat) => ({
                key: cat.slug,
                label: cat.name,
                img: getImageUrl(cat.image),
            })),
    ];

    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(true);
    const trackRef = useRef(null);

    const updateArrows = () => {
        const el = trackRef.current;
        if (!el) return;
        const { scrollLeft, clientWidth, scrollWidth } = el;
        setCanLeft(scrollLeft > 1);
        setCanRight(scrollLeft + clientWidth < scrollWidth - 1);
    };

    useEffect(() => {
        setTimeout(updateArrows, 100);
        const el = trackRef.current;
        if (!el) return;
        const onResize = () => updateArrows();
        window.addEventListener("resize", onResize);
        el.addEventListener("scroll", updateArrows);
        return () => {
            window.removeEventListener("resize", onResize);
            el?.removeEventListener("scroll", updateArrows);
        };
    }, [categories]);

    const scrollByStep = (dir) => {
        const el = trackRef.current;
        if (!el) return;
        const step = Math.round(el.clientWidth * 0.6);
        el.scrollBy({ left: dir * step, behavior: "smooth" });
    };

    return (
        <div className="sticky top-[64px] z-40 bg-white shadow-sm">
            <section className="max-w-4xl mx-auto px-4">
                <div className="relative flex items-center gap-3 py-3">
                    <button
                        onClick={() => scrollByStep(-1)}
                        aria-label="Prev"
                        disabled={!canLeft}
                        className={`shrink-0 grid place-items-center w-8 h-8 md:w-10 md:h-10 rounded-full transition-colors cursor-pointer border border-transparent
                        ${
                            canLeft
                                ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                : "bg-gray-50 text-gray-300 cursor-not-allowed opacity-50"
                        }`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div
                        ref={trackRef}
                        className="flex items-center gap-6 md:gap-8 overflow-x-auto scroll-smooth no-scrollbar flex-1"
                    >
                        {navItems.map((c) => {
                            const isActive = activeCategory === c.key;
                            return (
                                <button
                                    key={c.key}
                                    onClick={() => setActiveCategory(c.key)}
                                    className="shrink-0 flex flex-col items-center gap-1 cursor-pointer group min-w-[60px]"
                                    aria-pressed={isActive}
                                >
                                    <ColorIcon src={c.img} active={isActive} />
                                    <span
                                        className={`text-[10px] md:text-sm font-bold uppercase transition whitespace-nowrap ${
                                            isActive
                                                ? "text-[#FF8A00]"
                                                : "text-gray-400 group-hover:text-[#FF8A00]"
                                        }`}
                                    >
                                        {c.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => scrollByStep(1)}
                        aria-label="Next"
                        disabled={!canRight}
                        className={`shrink-0 grid place-items-center w-8 h-8 md:w-10 md:h-10 rounded-full transition-colors cursor-pointer
                        ${
                            canRight
                                ? "bg-[#FF8A00] text-white hover:bg-[#FFA33A] shadow-md"
                                : "bg-orange-100 text-white/60 cursor-not-allowed"
                        }`}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    <button
                        onClick={onSearchClick}
                        aria-label="Tìm kiếm"
                        className="shrink-0 grid place-items-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#19BFB0] text-white hover:opacity-90 transition cursor-pointer shadow-md"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default CategoryNav;
