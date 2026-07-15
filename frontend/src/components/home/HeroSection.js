"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { BannerService } from "@/services/bannerService";

const HeroSection = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await BannerService.getHomeBanners();
                setBanners(res.data);
            } catch (error) {
                console.error("Lỗi tải banner:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    const getImageUrl = (path) => {
        if (!path) return "https://placehold.co/800x400?text=No+Image";
        return path.startsWith("/uploads")
            ? `${process.env.NEXT_PUBLIC_API_URL.replace("/api", "")}${path}`
            : path;
    };

    if (loading) return <div className="h-64 bg-[#fff7f0] animate-pulse"></div>;
    if (banners.length === 0) return null;

    return (
        <div className="relative py-4 overflow-hidden">
            <div className="container mx-auto max-w-[1400px] relative group px-0">
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={12}
                    slidesPerView={"auto"}
                    centeredSlides={true}
                    loop={banners.length > 1}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    className="!pb-6 !overflow-visible"
                >
                    {banners.map((banner, index) => {
                        const linkHref = banner.promotion_slug
                            ? `/promotion/${banner.promotion_slug}`
                            : "#";

                        return (
                            <SwiperSlide
                                key={banner.id || index}
                                className="!w-[80%] md:!w-[75%] lg:!w-[65%] xl:!w-[60%] relative transition-transform"
                            >
                                {({ isActive, isPrev, isNext }) => (
                                    <Link
                                        href={linkHref}
                                        className="block w-full h-full"
                                    >
                                        <div
                                            className={`relative w-full rounded-3xl overflow-hidden shadow-lg transition-all duration-500 ease-out border border-white/50 ${
                                                isActive
                                                    ? "scale-100 opacity-100 z-20 shadow-2xl"
                                                    : "scale-[0.85] opacity-60 grayscale-[30%] blur-[0.5px] z-10"
                                            } ${isPrev ? "origin-right" : ""} ${
                                                isNext ? "origin-left" : ""
                                            } ${
                                                !isActive && !isPrev && !isNext
                                                    ? "scale-[0.85] opacity-60 origin-center"
                                                    : ""
                                            }`}
                                        >
                                            <div className="relative w-full aspect-[3/4] md:aspect-[10/3]">
                                                <div className="block md:hidden w-full h-full relative">
                                                    <Image
                                                        src={getImageUrl(
                                                            banner.image_mobile ||
                                                                banner.image_desktop
                                                        )}
                                                        alt={
                                                            banner.title ||
                                                            "Banner"
                                                        }
                                                        unoptimized={true}
                                                        fill
                                                        className="object-cover"
                                                        priority={index === 0}
                                                    />
                                                </div>

                                                <div className="hidden md:block w-full h-full relative">
                                                    <Image
                                                        src={getImageUrl(
                                                            banner.image_desktop
                                                        )}
                                                        alt={
                                                            banner.title ||
                                                            "Banner"
                                                        }
                                                        unoptimized={true}
                                                        fill
                                                        className="object-cover"
                                                        priority={index === 0}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </div>
    );
};

export default HeroSection;
