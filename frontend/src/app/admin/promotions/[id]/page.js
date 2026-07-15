"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PromotionService } from "@/services/promotionService";
import { ProductService } from "@/services/productService";
import {
    Save,
    ArrowLeft,
    Image as ImageIcon,
    Calendar,
    Tag,
    CheckSquare,
    UploadCloud,
    Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import AuthGuard from "@/components/auth/AuthGuard";

export default function PromotionFormPage() {
    const router = useRouter();
    const { id } = useParams();
    const isEdit = id && id !== "create";

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    const [info, setInfo] = useState({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        is_active: 1,
    });
    const [selectedDays, setSelectedDays] = useState(["All"]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const [products, setProducts] = useState([]);

    const daysOfWeek = [
        { value: "2", label: "T2" },
        { value: "3", label: "T3" },
        { value: "4", label: "T4" },
        { value: "5", label: "T5" },
        { value: "6", label: "T6" },
        { value: "7", label: "T7" },
        { value: "1", label: "CN" },
    ];

    useEffect(() => {
        const initData = async () => {
            try {
                const prodRes = await ProductService.getProducts();
                setProducts(prodRes.data);

                if (isEdit) {
                    const listRes = await PromotionService.getAll();
                    const promo = listRes.data.find((p) => p.id == id);

                    if (promo) {
                        setInfo({
                            name: promo.name,
                            description: promo.description || "",
                            start_date: promo.start_date
                                ? promo.start_date.slice(0, 16)
                                : "",
                            end_date: promo.end_date
                                ? promo.end_date.slice(0, 16)
                                : "",
                            is_active: promo.is_active,
                        });

                        if (promo.valid_days)
                            setSelectedDays(promo.valid_days.split(","));

                        if (promo.image) {
                            const imgUrl = promo.image.startsWith("/uploads")
                                ? `${process.env.NEXT_PUBLIC_API_URL.replace(
                                      "/api",
                                      ""
                                  )}${promo.image}`
                                : promo.image;
                            setPreview(imgUrl);
                        }
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

    const handleDayChange = (day) => {
        if (day === "All") {
            setSelectedDays(["All"]);
        } else {
            let newDays = selectedDays.filter((d) => d !== "All");
            if (newDays.includes(day))
                newDays = newDays.filter((d) => d !== day);
            else newDays.push(day);
            if (newDays.length === 0) newDays = ["All"];
            setSelectedDays(newDays);
        }
    };

    const handleProductChange = (pid) => {
        if (selectedProducts.includes(pid))
            setSelectedProducts(selectedProducts.filter((id) => id !== pid));
        else setSelectedProducts([...selectedProducts, pid]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("name", info.name);
        formData.append("description", info.description);
        formData.append("start_date", info.start_date);
        formData.append("end_date", info.end_date);
        formData.append("is_active", info.is_active ? 1 : 0);
        formData.append("valid_days", selectedDays.join(","));
        formData.append("product_ids", JSON.stringify(selectedProducts));

        if (imageFile) formData.append("image", imageFile);

        try {
            if (isEdit) {
                await PromotionService.update(id, formData);
                toast.info("Cập nhật thành công!");
            } else {
                await PromotionService.create(formData);
                toast.info("Tạo mới thành công!");
            }
            router.push("/admin/promotions");
        } catch (err) {
            toast.info("Lỗi: " + err.message);
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
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                    {isEdit
                                        ? "Sửa Khuyến Mãi"
                                        : "Tạo Khuyến Mãi Mới"}
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Thiết lập thông tin và thời gian áp dụng.
                                </p>
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
                                    checked={info.is_active == 1}
                                    onChange={(e) =>
                                        setInfo({
                                            ...info,
                                            is_active: e.target.checked ? 1 : 0,
                                        })
                                    }
                                />
                                <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer transition-colors duration-300 ease-in-out peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5.5 after:w-5.5 after:shadow-sm after:transition-all peer-checked:bg-[#00bfa5]"></div>
                                <span
                                    className={`ml-3 text-sm font-bold ${
                                        info.is_active
                                            ? "text-[#00bfa5]"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {info.is_active ? "Đang chạy" : "Tạm dừng"}
                                </span>
                            </label>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-200/60">
                                    <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                                        <div className="bg-orange-100 p-2.5 rounded-xl">
                                            <Tag
                                                size={22}
                                                className="text-[#f48120]"
                                            />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Thông tin chương trình
                                        </h2>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Tên chương trình{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Vd: Mua 1 Tặng 1 Thứ 4"
                                                className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#f48120]/10 focus:border-[#f48120] outline-none transition-all font-medium"
                                                value={info.name}
                                                onChange={(e) =>
                                                    setInfo({
                                                        ...info,
                                                        name: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Mô tả chi tiết
                                            </label>
                                            <textarea
                                                className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#f48120]/10 focus:border-[#f48120] outline-none transition-all h-32 resize-none"
                                                value={info.description}
                                                onChange={(e) =>
                                                    setInfo({
                                                        ...info,
                                                        description:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Nhập nội dung khuyến mãi..."
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-200/60">
                                    <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                                        <div className="bg-blue-100 p-2.5 rounded-xl">
                                            <Calendar
                                                size={22}
                                                className="text-blue-600"
                                            />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Thời gian áp dụng
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Ngày bắt đầu
                                            </label>
                                            <input
                                                type="datetime-local"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none"
                                                value={info.start_date}
                                                onChange={(e) =>
                                                    setInfo({
                                                        ...info,
                                                        start_date:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Ngày kết thúc
                                            </label>
                                            <input
                                                type="datetime-local"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none"
                                                value={info.end_date}
                                                onChange={(e) =>
                                                    setInfo({
                                                        ...info,
                                                        end_date:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3">
                                            Áp dụng vào thứ
                                        </label>
                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDayChange("All")
                                                }
                                                className={`px-5 py-2 rounded-lg font-bold text-sm transition-all border ${
                                                    selectedDays.includes("All")
                                                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                                                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                                }`}
                                            >
                                                Tất cả các ngày
                                            </button>
                                            <div className="w-px h-8 bg-gray-200 mx-2 hidden md:block"></div>
                                            {daysOfWeek.map((day) => (
                                                <button
                                                    key={day.value}
                                                    type="button"
                                                    onClick={() =>
                                                        handleDayChange(
                                                            day.value
                                                        )
                                                    }
                                                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-all border flex items-center justify-center ${
                                                        selectedDays.includes(
                                                            day.value
                                                        )
                                                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                                                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {day.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-200/60">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-green-100 p-2.5 rounded-xl">
                                            <CheckSquare
                                                size={22}
                                                className="text-green-600"
                                            />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Sản phẩm áp dụng
                                        </h2>
                                    </div>
                                    <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-4 max-h-80 overflow-y-auto custom-scrollbar">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {products.map((prod) => (
                                                <label
                                                    key={prod.id}
                                                    className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                                                        selectedProducts.includes(
                                                            prod.id
                                                        )
                                                            ? "bg-orange-50 border-orange-200 ring-1 ring-orange-200"
                                                            : "bg-white border-gray-200 hover:border-gray-300"
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProducts.includes(
                                                            prod.id
                                                        )}
                                                        onChange={() =>
                                                            handleProductChange(
                                                                prod.id
                                                            )
                                                        }
                                                        className="w-5 h-5 text-[#f48120] rounded focus:ring-[#f48120]"
                                                    />
                                                    <span
                                                        className={`text-sm font-medium ${
                                                            selectedProducts.includes(
                                                                prod.id
                                                            )
                                                                ? "text-[#f48120]"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        {prod.name}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-200/60 sticky top-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-purple-100 p-2.5 rounded-xl">
                                            <ImageIcon
                                                size={22}
                                                className="text-purple-600"
                                            />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Hình ảnh
                                        </h2>
                                    </div>
                                    <label
                                        className={`relative flex flex-col items-center justify-center w-full h-64 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group bg-gray-50/50 ${
                                            preview
                                                ? "border-purple-300 hover:border-purple-500"
                                                : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/30"
                                        }`}
                                    >
                                        {preview ? (
                                            <>
                                                <img
                                                    src={preview}
                                                    className="w-full h-full object-contain p-2"
                                                    alt="Preview"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                    <span className="text-white font-bold flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                                                        <ImageIcon size={20} />{" "}
                                                        Thay ảnh khác
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-purple-500 transition-colors">
                                                <UploadCloud
                                                    size={48}
                                                    className="mb-3 text-gray-300 group-hover:text-purple-400"
                                                />
                                                <p className="mb-1 text-sm font-bold">
                                                    Tải ảnh banner lên
                                                </p>
                                                <p className="text-xs">
                                                    PNG, JPG (Max 5MB)
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                setImageFile(e.target.files[0]);
                                                setPreview(
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
                                    {loading
                                        ? "Đang lưu..."
                                        : "Lưu chương trình"}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthGuard>
    );
}
