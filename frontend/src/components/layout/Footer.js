import React from "react";
import { Phone } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#f48120] text-white py-12">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <h2 className="text-3xl font-black uppercase mb-4 leading-none">
                        Gà Rán <br /> Crispc
                    </h2>
                    <div className="flex items-start space-x-2">
                        <Phone className="mt-1" size={20} />
                        <div>
                            <p className="text-sm font-medium">
                                Hotline đặt hàng nhanh chóng
                            </p>
                            <p className="text-3xl font-bold">19000000</p>
                        </div>
                    </div>
                    <p className="text-xs opacity-80 mt-4">
                        © 2025 Crispc Vietnam | Privacy Policy
                    </p>
                </div>

                <div className="space-y-2 text-sm font-medium">
                    <p className="hover:underline cursor-pointer">
                        Về chúng tôi
                    </p>
                    <p className="hover:underline cursor-pointer">Cửa hàng</p>
                    <p className="hover:underline cursor-pointer">
                        Theo dõi đơn hàng
                    </p>
                </div>

                <div className="space-y-2 text-sm font-medium">
                    <p className="hover:underline cursor-pointer">Thực đơn</p>
                    <p className="hover:underline cursor-pointer">Khuyến mãi</p>

                    <p className="hover:underline cursor-pointer">E-voucher</p>
                </div>

                <div className="flex flex-col items-start space-y-4">
                    <div className="rounded w-32">
                        <img
                            src="/images/credentials.png"
                            alt="BCT"
                            className="w-full"
                        />
                    </div>
                    <div className="flex space-x-2">
                        <img
                            src="/images/appstore-vn.png"
                            alt="App Store"
                            className="w-32 cursor-pointer"
                        />
                        <img
                            src="/images/playstore-vn.png"
                            alt="Google Play"
                            className="w-32 cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
