"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { CouponService } from "@/services/couponService";
import {
    Save,
    ArrowLeft,
    Loader2,
    Tag,
    DollarSign,
    Calendar,
} from "lucide-react";
import { toast } from "react-toastify";
import AuthGuard from "@/components/auth/AuthGuard";

export default function CouponFormPage() {
    const router = useRouter();
    const { id } = useParams();
    const isEdit = id && id !== "create";

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    const [info, setInfo] = useState({
        code: "",
        description: "",
        discount_type: "fixed",
        discount_value: 0,
        min_order_value: 0,
        max_discount_amount: 0,
        start_date: "",
        end_date: "",
        usage_limit: 0,
        is_active: 1,
    });

    useEffect(() => {
        const initData = async () => {
            if (isEdit) {
                try {
                    const res = await CouponService.getDetail(id);
                    if (res.data) {
                        const formatInputDate = (d) =>
                            d ? new Date(d).toISOString().slice(0, 16) : "";

                        setInfo({
                            code: res.data.code || "",
                            description: res.data.description || "",
                            discount_type: res.data.discount_type || "fixed",
                            discount_value: res.data.discount_value || 0,
                            min_order_value: res.data.min_order_value || 0,
                            max_discount_amount:
                                res.data.max_discount_amount || 0,
                            start_date: formatInputDate(res.data.start_date),
                            end_date: formatInputDate(res.data.end_date),
                            usage_limit: res.data.usage_limit || 0,
                            is_active: res.data.is_active ?? 1,
                        });
                    }
                } catch (err) {
                    console.error("Lỗi tải chi tiết:", err);
                } finally {
                    setFetching(false);
                }
            } else {
                setFetching(false);
            }
        };
        initData();
    }, [isEdit, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await CouponService.update(id, info);
                toast.info("Cập nhật thành công!");
            } else {
                await CouponService.create(info);
                toast.info("Tạo mã thành công!");
            }
            router.push("/admin/coupons");
        } catch (err) {
            toast.info("Lỗi: " + (err.response?.data?.message || err.message));
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
                                        ? "Sửa Mã Giảm Giá"
                                        : "Tạo Mã Giảm Giá"}
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
                                    {info.is_active ? "Hoạt động" : "Tạm dừng"}
                                </span>
                            </label>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-200/60">
                                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                    <div className="bg-orange-100 p-2.5 rounded-xl text-[#f48120]">
                                        <Tag size={22} />
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-900">
                                        Thông tin cơ bản
                                    </h3>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Mã Code
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#f48120]/10 focus:border-[#f48120] outline-none transition-all font-mono uppercase font-bold text-lg tracking-wider"
                                            placeholder="Vd: TET2025"
                                            value={info.code}
                                            onChange={(e) =>
                                                setInfo({
                                                    ...info,
                                                    code: e.target.value
                                                        .toUpperCase()
                                                        .replace(/\s/g, ""),
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Mô tả chương trình
                                        </label>
                                        <textarea
                                            className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#f48120]/10 focus:border-[#f48120] outline-none transition-all h-24 resize-none"
                                            placeholder="Vd: Giảm 20k cho đơn từ 100k áp dụng cho khách hàng mới..."
                                            value={info.description}
                                            onChange={(e) =>
                                                setInfo({
                                                    ...info,
                                                    description: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-200/60">
                                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                    <div className="bg-green-100 p-2.5 rounded-xl text-green-600">
                                        <DollarSign size={22} />
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-900">
                                        Mức giảm giá
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Loại giảm giá
                                        </label>
                                        <select
                                            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:border-[#f48120] outline-none bg-white font-medium"
                                            value={info.discount_type}
                                            onChange={(e) =>
                                                setInfo({
                                                    ...info,
                                                    discount_type:
                                                        e.target.value,
                                                })
                                            }
                                        >
                                            <option value="fixed">
                                                Số tiền cố định (VND)
                                            </option>
                                            <option value="percent">
                                                Theo phần trăm (%)
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Giá trị giảm{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                required
                                                type="number"
                                                min="0"
                                                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:border-[#f48120] outline-none pl-5 pr-12 font-bold text-lg"
                                                value={info.discount_value}
                                                onChange={(e) =>
                                                    setInfo({
                                                        ...info,
                                                        discount_value:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                                                {info.discount_type ===
                                                "percent"
                                                    ? "%"
                                                    : "đ"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {info.discount_type === "percent" && (
                                    <div className="mb-6 p-4 bg-orange-50 rounded-xl border border-orange-100/50">
                                        <label className="block text-sm font-bold text-gray-800 mb-1">
                                            Giảm tối đa (Optional)
                                        </label>
                                        <p className="text-xs text-gray-500 mb-3">
                                            Giới hạn số tiền giảm tối đa khi
                                            dùng % (Vd: Giảm 50% nhưng tối đa
                                            chỉ 30k)
                                        </p>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:border-[#f48120] outline-none"
                                                placeholder="0 = Không giới hạn"
                                                value={info.max_discount_amount}
                                                onChange={(e) =>
                                                    setInfo({
                                                        ...info,
                                                        max_discount_amount:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">
                                                đ
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Giá trị đơn hàng tối thiểu
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:border-[#f48120] outline-none"
                                            placeholder="Vd: 100000"
                                            value={info.min_order_value}
                                            onChange={(e) =>
                                                setInfo({
                                                    ...info,
                                                    min_order_value:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                                            đ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-200/60 sticky top-8">
                                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                    <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
                                        <Calendar size={22} />
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-900">
                                        Thời hạn & Giới hạn
                                    </h3>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Ngày bắt đầu
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none cursor-pointer text-sm"
                                            value={info.start_date}
                                            onChange={(e) =>
                                                setInfo({
                                                    ...info,
                                                    start_date: e.target.value,
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
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none cursor-pointer text-sm"
                                            value={info.end_date}
                                            onChange={(e) =>
                                                setInfo({
                                                    ...info,
                                                    end_date: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Giới hạn lượt dùng
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-blue-500 outline-none"
                                            placeholder="0 = Vô hạn"
                                            value={info.usage_limit}
                                            onChange={(e) =>
                                                setInfo({
                                                    ...info,
                                                    usage_limit: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="border-t border-gray-100 my-4"></div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 bg-[#f48120] hover:bg-[#d96e17] text-white font-bold rounded-xl shadow-lg shadow-orange-200 flex items-center justify-center gap-2 transition disabled:opacity-70 disabled:shadow-none"
                                    >
                                        {loading ? (
                                            <Loader2
                                                className="animate-spin"
                                                size={20}
                                            />
                                        ) : (
                                            <Save size={20} />
                                        )}
                                        <span>
                                            {loading
                                                ? "Đang xử lý..."
                                                : "Lưu Thay Đổi"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthGuard>
    );
}
