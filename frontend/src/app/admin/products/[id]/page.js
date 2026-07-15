"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProductService } from "@/services/productService";
import {
    Plus,
    Trash2,
    X,
    Loader2,
    Save,
    ArrowLeft,
    Image as ImageIcon,
    Layers,
    DollarSign,
    Tag,
    Info,
    GripVertical,
    UploadCloud,
} from "lucide-react";
import { toast } from "react-toastify";
import AuthGuard from "@/components/auth/AuthGuard";

export default function ProductFormPage() {
    const router = useRouter();
    const params = useParams();
    const isEditMode = params.id && params.id !== "create";

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);
    const [categories, setCategories] = useState([]);

    const [info, setInfo] = useState({
        name: "",
        category_id: "",
        price: "",
        original_price: "",
        description: "",
        is_active: 1,
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const [optionGroups, setOptionGroups] = useState([]);

    useEffect(() => {
        const initData = async () => {
            try {
                const catRes = await ProductService.getCategories();
                setCategories(catRes.data);

                if (isEditMode) {
                    const productRes = await ProductService.getProductDetail(
                        params.id
                    );
                    const product = productRes.data;
                    setInfo({
                        name: product.name,
                        category_id: product.category_id || "",
                        price: product.price,
                        original_price: product.original_price || "",
                        description: product.description || "",
                        is_active: product.is_active,
                    });
                    if (product.image) {
                        const imgUrl = product.image.startsWith("/uploads")
                            ? `${process.env.NEXT_PUBLIC_API_URL.replace(
                                  "/api",
                                  ""
                              )}${product.image}`
                            : product.image;
                        setPreviewImage(imgUrl);
                    }
                    if (product.option_groups)
                        setOptionGroups(product.option_groups);
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            } finally {
                setFetching(false);
            }
        };
        initData();
    }, [isEditMode, params.id]);

    const addGroup = () =>
        setOptionGroups([
            ...optionGroups,
            { name: "", min_select: 1, max_select: 1, options: [] },
        ]);
    const removeGroup = (idx) => {
        const n = [...optionGroups];
        n.splice(idx, 1);
        setOptionGroups(n);
    };
    const updateGroup = (idx, f, v) => {
        const n = [...optionGroups];
        n[idx][f] = v;
        setOptionGroups(n);
    };
    const addOptionToGroup = (gIdx) => {
        const n = [...optionGroups];
        n[gIdx].options.push({ name: "", price_adjustment: 0 });
        setOptionGroups(n);
    };
    const removeOptionFromGroup = (gIdx, oIdx) => {
        const n = [...optionGroups];
        n[gIdx].options.splice(oIdx, 1);
        setOptionGroups(n);
    };
    const updateOption = (gIdx, oIdx, f, v) => {
        const n = [...optionGroups];
        n[gIdx].options[oIdx][f] = v;
        setOptionGroups(n);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("name", info.name);
        formData.append("category_id", info.category_id);
        formData.append("price", info.price);
        formData.append("original_price", info.original_price);
        formData.append("description", info.description);
        formData.append("is_active", info.is_active ? 1 : 0);
        if (imageFile) formData.append("image", imageFile);
        formData.append("option_groups", JSON.stringify(optionGroups));

        try {
            if (isEditMode) {
                await ProductService.updateProduct(params.id, formData);
                toast.info("Cập nhật thành công!");
            } else {
                await ProductService.createProduct(formData);
                toast.info("Thêm mới thành công!");
            }
            router.push("/admin/products");
        } catch (error) {
            toast.info(
                "Lỗi: " + (error.response?.data?.message || error.message)
            );
        } finally {
            setLoading(false);
        }
    };

    if (fetching)
        return (
            <div className="flex items-center justify-center min-h-screen text-[#f48120]">
                <Loader2 size={40} className="animate-spin" />
            </div>
        );

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <div className="min-h-screen bg-gray-100 px-6 py-8">
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
                                    {isEditMode
                                        ? "Chỉnh sửa sản phẩm"
                                        : "Tạo sản phẩm mới"}
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
                                    {info.is_active ? "Đang bán" : "Tạm ẩn"}
                                </span>
                            </label>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-200/60">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="bg-orange-100 p-2.5 rounded-xl">
                                            <Info
                                                size={22}
                                                className="text-[#f48120]"
                                            />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Thông tin cơ bản
                                        </h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Tên món ăn{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Vd: Combo Gà Rán Vui Vẻ"
                                                className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#f48120]/10 focus:border-[#f48120] outline-none transition-all text-gray-800 font-medium"
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
                                                Mô tả ngắn
                                            </label>
                                            <textarea
                                                className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#f48120]/10 focus:border-[#f48120] outline-none transition-all h-36 resize-none text-gray-700"
                                                value={info.description}
                                                onChange={(e) =>
                                                    setInfo({
                                                        ...info,
                                                        description:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Mô tả thành phần món ăn, điểm nổi bật..."
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-200/60">
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-100 p-2.5 rounded-xl">
                                                <Layers
                                                    size={22}
                                                    className="text-blue-600"
                                                />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">
                                                    Nhóm tùy chọn
                                                </h2>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addGroup}
                                            className="text-sm bg-blue-50 text-blue-700 px-5 py-2.5 rounded-xl font-bold hover:bg-blue-100 transition flex items-center gap-2 shadow-sm"
                                        >
                                            <Plus size={18} /> Thêm nhóm
                                        </button>
                                    </div>

                                    {optionGroups.length === 0 ? (
                                        <div className="text-center py-12 bg-gray-50/80 rounded-2xl border-2 border-dashed border-gray-300">
                                            <Layers
                                                size={40}
                                                className="mx-auto text-gray-300 mb-3"
                                            />
                                            <p className="text-gray-500 font-medium">
                                                Chưa có tùy chọn nào.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={addGroup}
                                                className="text-[#f48120] font-bold hover:underline flex items-center justify-center gap-1 mx-auto"
                                            >
                                                <Plus size={16} /> Thêm nhóm
                                                ngay
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            {optionGroups.map(
                                                (group, gIndex) => (
                                                    <div
                                                        key={gIndex}
                                                        className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 group/card"
                                                    >
                                                        <div className="bg-gray-100/80 px-6 py-4 flex items-start gap-4 border-b border-gray-200">
                                                            <div className="mt-3 text-gray-400 cursor-grab active:cursor-grabbing hover:text-gray-600 transition">
                                                                <GripVertical
                                                                    size={22}
                                                                />
                                                            </div>
                                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                                                                <div className="md:col-span-6">
                                                                    <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1 block">
                                                                        Tên nhóm
                                                                    </label>
                                                                    <input
                                                                        placeholder="Nhập nhóm lựa chọn"
                                                                        className="w-full bg-transparent border-b-2 border-gray-300 focus:border-blue-500 px-0 py-2 text-base font-bold text-gray-800 outline-none transition-colors placeholder:font-normal"
                                                                        value={
                                                                            group.name
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updateGroup(
                                                                                gIndex,
                                                                                "name",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="md:col-span-3">
                                                                    <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1 block text-center">
                                                                        Tối
                                                                        thiểu
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        className="w-full bg-white border border-gray-300 p-2 rounded-lg text-sm text-center font-bold text-gray-700 focus:border-blue-500 outline-none"
                                                                        value={
                                                                            group.min_select
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updateGroup(
                                                                                gIndex,
                                                                                "min_select",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="md:col-span-3">
                                                                    <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1 block text-center">
                                                                        Tối đa
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        className="w-full bg-white border border-gray-300 p-2 rounded-lg text-sm text-center font-bold text-gray-700 focus:border-blue-500 outline-none"
                                                                        value={
                                                                            group.max_select
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updateGroup(
                                                                                gIndex,
                                                                                "max_select",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeGroup(
                                                                        gIndex
                                                                    )
                                                                }
                                                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition ml-2 opacity-0 group-hover/card:opacity-100"
                                                            >
                                                                <Trash2
                                                                    size={20}
                                                                />
                                                            </button>
                                                        </div>

                                                        <div className="p-6 bg-white">
                                                            <div className="space-y-3">
                                                                {group.options.map(
                                                                    (
                                                                        opt,
                                                                        oIndex
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                oIndex
                                                                            }
                                                                            className="flex gap-3 items-center group/opt pl-8 relative"
                                                                        >
                                                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-[2px] bg-gray-200"></div>
                                                                            <div className="flex-1">
                                                                                <input
                                                                                    placeholder="Nhập tên lựa chọn"
                                                                                    className="w-full border border-gray-200 bg-gray-50/50 px-4 py-2.5 rounded-xl text-sm focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition font-medium"
                                                                                    value={
                                                                                        opt.name
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        updateOption(
                                                                                            gIndex,
                                                                                            oIndex,
                                                                                            "name",
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                            <div className="w-36 relative">
                                                                                <input
                                                                                    placeholder="0"
                                                                                    type="number"
                                                                                    className="w-full border border-gray-200 bg-gray-50/50 px-4 py-2.5 pl-8 rounded-xl text-sm focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition text-right font-bold text-gray-700"
                                                                                    value={
                                                                                        opt.price_adjustment
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        updateOption(
                                                                                            gIndex,
                                                                                            oIndex,
                                                                                            "price_adjustment",
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                />
                                                                                <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-bold">
                                                                                    +
                                                                                </span>
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    removeOptionFromGroup(
                                                                                        gIndex,
                                                                                        oIndex
                                                                                    )
                                                                                }
                                                                                className="text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition opacity-0 group-hover/opt:opacity-100"
                                                                            >
                                                                                <X
                                                                                    size={
                                                                                        20
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    addOptionToGroup(
                                                                        gIndex
                                                                    )
                                                                }
                                                                className="mt-5 w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 font-bold hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition flex items-center justify-center gap-2"
                                                            >
                                                                <Plus
                                                                    size={18}
                                                                />{" "}
                                                                Thêm lựa chọn
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-200/60 top-24">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="bg-green-100 p-2.5 rounded-xl">
                                            <Tag
                                                size={22}
                                                className="text-green-600"
                                            />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Phân loại & Giá
                                        </h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Danh mục{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    required
                                                    className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none appearance-none font-medium text-gray-800 cursor-pointer transition-all"
                                                    value={info.category_id}
                                                    onChange={(e) =>
                                                        setInfo({
                                                            ...info,
                                                            category_id:
                                                                e.target.value,
                                                        })
                                                    }
                                                >
                                                    <option value="">
                                                        -- Chọn danh mục --
                                                    </option>
                                                    {categories.map((c) => (
                                                        <option
                                                            key={c.id}
                                                            value={c.id}
                                                        >
                                                            {c.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                    <svg
                                                        className="w-5 h-5 fill-current"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Giá bán
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                    <DollarSign size={20} />
                                                </span>
                                                <input
                                                    required
                                                    type="number"
                                                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-300 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none font-bold text-gray-800 text-base transition-all"
                                                    value={info.price}
                                                    onChange={(e) =>
                                                        setInfo({
                                                            ...info,
                                                            price: e.target
                                                                .value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Giá gốc
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Để trống nếu không giảm giá"
                                                className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-gray-100 focus:border-gray-400 outline-none text-gray-500 font-medium transition-all"
                                                value={info.original_price}
                                                onChange={(e) =>
                                                    setInfo({
                                                        ...info,
                                                        original_price:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-200/60">
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

                                    <div className="w-full">
                                        <label
                                            className={`relative flex flex-col items-center justify-center w-full h-72 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group bg-gray-50/50
                                        ${
                                            previewImage
                                                ? "border-purple-300 hover:border-purple-500"
                                                : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/30"
                                        }`}
                                        >
                                            {previewImage ? (
                                                <>
                                                    <img
                                                        src={previewImage}
                                                        className="w-full h-full object-contain p-4"
                                                        alt="Preview"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                        <span className="text-white font-bold flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                                                            <ImageIcon
                                                                size={20}
                                                            />{" "}
                                                            Thay ảnh khác
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400 group-hover:text-purple-500 transition-colors">
                                                    <UploadCloud
                                                        size={56}
                                                        className="mb-4 text-gray-300 group-hover:text-purple-400 transition-colors"
                                                    />
                                                    <p className="mb-2 text-base font-bold">
                                                        Kéo thả hoặc bấm để tải
                                                        ảnh lên
                                                    </p>
                                                    <p className="text-xs opacity-70">
                                                        PNG, JPG, WEBP (Max 5MB)
                                                    </p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files[0];
                                                    if (file) {
                                                        setImageFile(file);
                                                        setPreviewImage(
                                                            URL.createObjectURL(
                                                                file
                                                            )
                                                        );
                                                    }
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
                                className="px-8 py-3 rounded-xl bg-white border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-400 transition shadow-sm"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-10 py-3 rounded-xl bg-[#f48120] text-white font-bold hover:bg-[#d96e17] transition shadow-lg shadow-orange-200/50 flex items-center gap-3 disabled:bg-gray-300 disabled:shadow-none text-lg"
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
                                    {loading ? "Đang xử lý..." : "Lưu sản phẩm"}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthGuard>
    );
}
