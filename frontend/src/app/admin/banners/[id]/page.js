"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { BannerService } from "@/services/bannerService";
import { PromotionService } from "@/services/promotionService";
import {
    Save,
    ArrowLeft,
    Loader2,
    Monitor,
    Smartphone,
    UploadCloud,
    Link as LinkIcon,
    Tag,
} from "lucide-react";
import { toast } from "react-toastify";
import AuthGuard from "@/components/auth/AuthGuard";

export default function BannerFormPage() {
    const router = useRouter();
    const { id } = useParams();
    const isEdit = id && id !== "create";

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    const [title, setTitle] = useState("");
    const [promotionId, setPromotionId] = useState("");
    const [isActive, setIsActive] = useState(1);

    const [fileDesktop, setFileDesktop] = useState(null);
    const [previewDesktop, setPreviewDesktop] = useState(null);
    const [fileMobile, setFileMobile] = useState(null);
    const [previewMobile, setPreviewMobile] = useState(null);

    const [promotions, setPromotions] = useState([]);

    useEffect(() => {
        const initData = async () => {
            try {
                const promoRes = await PromotionService.getAll();
                setPromotions(promoRes.data);

                if (isEdit) {
                    const bannerListRes = await BannerService.getAll();
                    const banner = bannerListRes.data.find((b) => b.id == id);

                    if (banner) {
                        setTitle(banner.title);
                        setPromotionId(banner.promotion_id || "");
                        setIsActive(banner.is_active);

                        if (banner.image_desktop)
                            setPreviewDesktop(
                                getImageUrl(banner.image_desktop)
                            );
                        if (banner.image_mobile)
                            setPreviewMobile(getImageUrl(banner.image_mobile));
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setFetching(false);
            }
        };
        initData();
    }, [isEdit, id]);

    const getImageUrl = (path) =>
        path?.startsWith("/uploads")
            ? `${(process.env.NEXT_PUBLIC_API_URL || "").replace("/api", "")}${path}`
            : path;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("promotion_id", promotionId);
        formData.append("is_active", isActive ? 1 : 0);

        if (fileDesktop) formData.append("image_desktop", fileDesktop);
        if (fileMobile) formData.append("image_mobile", fileMobile);

        try {
            if (isEdit) {
                await BannerService.update(id, formData);
                toast.info("Cập nhật thành công!");
            } else {
                await BannerService.create(formData);
                toast.info("Tạo mới thành công!");
            }
            router.push("/admin/banners");
        } catch (err) {
            toast.info(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching)
        return (
            <div className="flex h-screen items-center justify-center text-[#f48120]">
                <Loader2 size={40} className="animate-spin" />
            </div>
        );

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <div className="min-h-screen bg-gray-100 px-6 py-8 pb-24">
                <div className="max-w-8xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="group bg-white p-3 rounded-full shadow-sm border border-gray-200 hover:border-[#f48120] hover:text-[#f48120] transition-all"
                            >
                                <ArrowLeft
                                    size={20}
                                    className="text-gray-600 group-hover:text-[#f48120] transition-colors"
                                />
                            </button>
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                    {isEdit
                                        ? "Chỉnh sửa Banner"
                                        : "Thêm Banner Mới"}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-200">
                            <span className="text-sm font-semibold text-gray-700">
                                Trạng thái:
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={isActive == 1}
                                    onChange={(e) =>
                                        setIsActive(e.target.checked ? 1 : 0)
                                    }
                                />
                                <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer transition-colors duration-300 ease-in-out peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5.5 after:w-5.5 after:shadow-sm after:transition-all peer-checked:bg-[#00bfa5]"></div>
                                <span
                                    className={`ml-3 text-sm font-bold ${
                                        isActive
                                            ? "text-[#00bfa5]"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {isActive ? "Hiển thị" : "Đã ẩn"}
                                </span>
                            </label>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-8">
                                <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-200/60 sticky top-8">
                                    <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                                        <div className="bg-orange-100 p-2.5 rounded-xl">
                                            <Tag
                                                size={22}
                                                className="text-[#f48120]"
                                            />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Thông tin chung
                                        </h2>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Tên Banner{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Vd: Banner Tết 2025"
                                                className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#f48120]/10 focus:border-[#f48120] outline-none transition-all font-medium"
                                                value={title}
                                                onChange={(e) =>
                                                    setTitle(e.target.value)
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                <LinkIcon size={16} /> Liên kết
                                                đến chương trình
                                            </label>
                                            <div className="relative">
                                                <select
                                                    className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#f48120]/10 focus:border-[#f48120] outline-none appearance-none font-medium cursor-pointer"
                                                    value={promotionId}
                                                    onChange={(e) =>
                                                        setPromotionId(
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        -- Chọn Khuyến Mãi --
                                                    </option>
                                                    {promotions.map((p) => (
                                                        <option
                                                            key={p.id}
                                                            value={p.id}
                                                        >
                                                            {p.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                    ▼
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-200/60">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-blue-100 p-2.5 rounded-xl">
                                            <Monitor
                                                size={22}
                                                className="text-blue-600"
                                            />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">
                                                Ảnh Desktop
                                            </h2>
                                        </div>
                                    </div>
                                    <label
                                        className={`relative flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group bg-gray-50/50 ${
                                            previewDesktop
                                                ? "border-blue-300 hover:border-blue-500"
                                                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
                                        }`}
                                    >
                                        {previewDesktop ? (
                                            <img
                                                src={previewDesktop}
                                                className="w-full h-full object-cover"
                                                alt="Desktop Preview"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-blue-500">
                                                <UploadCloud
                                                    size={40}
                                                    className="mb-2"
                                                />
                                                <span className="font-bold text-sm">
                                                    Tải ảnh ngang
                                                </span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                setFileDesktop(
                                                    e.target.files[0]
                                                );
                                                setPreviewDesktop(
                                                    URL.createObjectURL(
                                                        e.target.files[0]
                                                    )
                                                );
                                            }}
                                        />
                                    </label>
                                </div>

                                <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-200/60">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-purple-100 p-2.5 rounded-xl">
                                            <Smartphone
                                                size={22}
                                                className="text-purple-600"
                                            />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">
                                                Ảnh Mobile
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="flex justify-center bg-gray-100 rounded-2xl p-6">
                                        <label
                                            className={`relative flex flex-col items-center justify-center w-64 h-64 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group bg-white shadow-sm ${
                                                previewMobile
                                                    ? "border-purple-300 hover:border-purple-500"
                                                    : "border-gray-300 hover:border-purple-400"
                                            }`}
                                        >
                                            {previewMobile ? (
                                                <img
                                                    src={previewMobile}
                                                    className="w-full h-full object-cover"
                                                    alt="Mobile Preview"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-purple-500">
                                                    <UploadCloud
                                                        size={40}
                                                        className="mb-2"
                                                    />
                                                    <span className="font-bold text-sm">
                                                        Tải ảnh dọc/vuông
                                                    </span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    setFileMobile(
                                                        e.target.files[0]
                                                    );
                                                    setPreviewMobile(
                                                        URL.createObjectURL(
                                                            e.target.files[0]
                                                        )
                                                    );
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-8 py-3 rounded-xl bg-white border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition shadow-sm"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-10 py-3 rounded-xl bg-[#f48120] text-white font-bold hover:bg-[#d96e17] transition shadow-lg shadow-orange-200/50 flex items-center gap-3 disabled:bg-gray-300"
                            >
                                {loading ? (
                                    <Loader2
                                        className="animate-spin"
                                        size={22}
                                    />
                                ) : (
                                    <Save size={22} />
                                )}
                                <span>
                                    {loading ? "Đang lưu..." : "Lưu Banners"}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthGuard>
    );
}
