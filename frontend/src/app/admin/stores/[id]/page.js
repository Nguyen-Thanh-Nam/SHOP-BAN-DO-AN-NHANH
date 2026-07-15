"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { StoreService } from "@/services/storeService";
import {
    Save,
    ArrowLeft,
    Loader2,
    Map,
    Clock,
    Phone,
    MapPin,
} from "lucide-react";
import { toast } from "react-toastify";
import AuthGuard from "@/components/auth/AuthGuard";

export default function StoreFormPage() {
    const router = useRouter();
    const { id } = useParams();
    const isEdit = id && id !== "create";

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    const [info, setInfo] = useState({
        name: "",
        address: "",
        phone: "",
        open_time: "08:00",
        close_time: "22:00",
        latitude: "",
        longitude: "",
        is_active: 1,
    });

    useEffect(() => {
        const initData = async () => {
            if (isEdit) {
                try {
                    const res = await StoreService.getDetail(id);
                    if (res.data) {
                        setInfo(res.data);
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
                await StoreService.update(id, info);
                toast.info("Cập nhật thành công!");
            } else {
                await StoreService.create(info);
                toast.info("Tạo cửa hàng mới thành công!");
            }
            router.push("/admin/stores");
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
                                        ? "Chỉnh sửa Cửa Hàng"
                                        : "Thêm Cửa Hàng Mới"}
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
                                    {info.is_active ? "Hoạt động" : "Đóng cửa"}
                                </span>
                            </label>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-200/60">
                                <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                                    <div className="bg-orange-100 p-2.5 rounded-xl">
                                        <MapPin
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
                                            Tên Chi Nhánh{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Vd: Popeyes Nguyễn Thị Thập"
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
                                            Địa chỉ hiển thị{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            required
                                            placeholder="Vd: 332 Nguyễn Thị Thập, P. Tân Quy, Quận 7, TP. HCM"
                                            className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#f48120]/10 focus:border-[#f48120] outline-none transition-all h-24 resize-none"
                                            value={info.address}
                                            onChange={(e) =>
                                                setInfo({
                                                    ...info,
                                                    address: e.target.value,
                                                })
                                            }
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <Phone size={16} /> Số điện thoại
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Vd: 1900 6008"
                                            className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#f48120]/10 focus:border-[#f48120] outline-none transition-all font-medium"
                                            value={info.phone}
                                            onChange={(e) =>
                                                setInfo({
                                                    ...info,
                                                    phone: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-200/60">
                                <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                                    <div className="bg-blue-100 p-2.5 rounded-xl">
                                        <Clock
                                            size={22}
                                            className="text-blue-600"
                                        />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Vận hành
                                    </h2>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Giờ mở cửa
                                        </label>
                                        <input
                                            type="time"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none cursor-pointer"
                                            value={info.open_time}
                                            onChange={(e) =>
                                                setInfo({
                                                    ...info,
                                                    open_time: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Giờ đóng cửa
                                        </label>
                                        <input
                                            type="time"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none cursor-pointer"
                                            value={info.close_time}
                                            onChange={(e) =>
                                                setInfo({
                                                    ...info,
                                                    close_time: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Map
                                            size={20}
                                            className="text-blue-500"
                                        />
                                        <h3 className="font-bold text-gray-800">
                                            Tọa độ bản đồ
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                                Vĩ độ
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                placeholder="10.762..."
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none font-mono text-sm"
                                                value={info.latitude}
                                                onChange={(e) =>
                                                    setInfo({
                                                        ...info,
                                                        latitude:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                                Kinh độ
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                placeholder="106.660..."
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none font-mono text-sm"
                                                value={info.longitude}
                                                onChange={(e) =>
                                                    setInfo({
                                                        ...info,
                                                        longitude:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 flex justify-end gap-4 mt-4 pt-6 border-t border-gray-200">
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
                                className="px-10 py-3 rounded-xl bg-[#f48120] text-white font-bold hover:bg-[#d96e17] transition shadow-lg shadow-orange-200 flex items-center gap-3 disabled:bg-gray-300 disabled:shadow-none"
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
                                    {loading ? "Đang lưu..." : "Lưu thông tin"}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthGuard>
    );
}
