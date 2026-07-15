"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const ProductGrid = ({ items, type = "menu", onItemClick }) => {
    const isPromo = type === "promo";

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {items.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onItemClick(item)}
                        className="group bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)] transition duration-300 overflow-hidden border border-gray-100 flex flex-col cursor-pointer h-full"
                    >
                        <div className="relative aspect-square w-full bg-gray-100">
                            <Image
                                unoptimized={true}
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-105 transition duration-500"
                            />
                        </div>

                        <div className="p-5 flex flex-col items-center flex-grow text-center">
                            <h4 className="font-bold text-[#f48120] text-[15px] leading-snug line-clamp-2 mb-3 min-h-[42px]">
                                {item.title}
                            </h4>

                            <div className="mt-auto w-full">
                                {!isPromo ? (
                                    <span className="text-[#002b5c] font-bold text-lg">
                                        {item.price}
                                    </span>
                                ) : (
                                    <button
                                        disabled={!item.isAvailable}
                                        className={`w-full text-white text-xs font-bold py-2 rounded-full uppercase shadow-sm ${
                                            item.isAvailable
                                                ? "bg-[#f48120] hover:bg-[#d96e17]"
                                                : "bg-[#b0b0b0] cursor-not-allowed"
                                        }`}
                                    >
                                        {item.buttonText}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductGrid;
