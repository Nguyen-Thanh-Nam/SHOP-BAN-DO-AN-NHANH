"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    DollarSign,
    ShoppingBag,
    Users,
    Package,
    ArrowUpRight,
    Calendar,
    ArrowRight,
    TrendingUp,
    CalendarRange,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { DashboardService } from "@/services/dashboardService";

export default function DashboardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await DashboardService.getStats();
                setData(res);
            } catch (error) {
                console.error("Lỗi tải dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatCurrency = (amount) => {
        return parseInt(amount || 0).toLocaleString("vi-VN") + " đ";
    };

    const StatCard = ({
        title,
        value,
        icon: Icon,
        colorClass,
        bgClass,
        subText,
    }) => (
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                    {title}
                </p>
                <h3 className="text-2xl font-extrabold text-gray-900">
                    {value}
                </h3>
                <div className="flex items-center mt-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg w-fit">
                    <ArrowUpRight size={14} className="mr-1" />{" "}
                    {subText || "+12% so với trước"}
                </div>
            </div>
            <div className={`p-3 rounded-xl ${bgClass}`}>
                <Icon size={24} className={colorClass} />
            </div>
        </div>
    );

    if (loading)
        return (
            <div className="p-8 text-center text-gray-500">
                Đang tải dữ liệu tổng quan...
            </div>
        );
    if (!data) return null;

    return (
        <div className="min-h-screen bg-gray-50/50 p-8 flex-1 flex flex-col">
            <div className="w-full space-y-8 flex-1 flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Tổng quan
                        </h1>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 text-sm font-medium text-gray-600 flex items-center gap-2">
                        <Calendar size={16} />{" "}
                        {new Date().toLocaleDateString("vi-VN")}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        title="Tổng doanh thu (Trọn đời)"
                        value={formatCurrency(data.counts.revenue)}
                        icon={DollarSign}
                        colorClass="text-green-600"
                        bgClass="bg-green-100"
                        subText="Tích lũy toàn thời gian"
                    />
                    <StatCard
                        title="Doanh thu tháng này"
                        value={formatCurrency(data.counts.monthlyRevenue)}
                        icon={TrendingUp}
                        colorClass="text-blue-600"
                        bgClass="bg-blue-100"
                        subText={`Tháng ${new Date().getMonth() + 1}`}
                    />
                    <StatCard
                        title="Doanh thu năm nay"
                        value={formatCurrency(data.counts.yearlyRevenue)}
                        icon={CalendarRange}
                        colorClass="text-indigo-600"
                        bgClass="bg-indigo-100"
                        subText={`Năm ${new Date().getFullYear()}`}
                    />

                    <StatCard
                        title="Tổng đơn hàng"
                        value={data.counts.orders}
                        icon={ShoppingBag}
                        colorClass="text-orange-600"
                        bgClass="bg-orange-100"
                    />
                    <StatCard
                        title="Khách hàng"
                        value={data.counts.users}
                        icon={Users}
                        colorClass="text-purple-600"
                        bgClass="bg-purple-100"
                    />
                    <StatCard
                        title="Sản phẩm đang bán"
                        value={data.counts.products}
                        icon={Package}
                        colorClass="text-pink-600"
                        bgClass="bg-pink-100"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                    <div className="lg:col-span-2 bg-white p-6 rounded-[20px] shadow-sm border border-gray-200 flex flex-col flex-1">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">
                            Biểu đồ doanh thu (7 ngày)
                        </h2>
                        <div className="flex-1 w-full min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.chartData}>
                                    <defs>
                                        <linearGradient
                                            id="colorSales"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#f48120"
                                                stopOpacity={0.2}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#f48120"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#E5E7EB"
                                    />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#6B7280", fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#6B7280", fontSize: 12 }}
                                        tickFormatter={(value) =>
                                            `${value / 1000000}M`
                                        }
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "12px",
                                            border: "none",
                                            boxShadow:
                                                "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                        }}
                                        formatter={(value) =>
                                            formatCurrency(value)
                                        }
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="#f48120"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorSales)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-200 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-900">
                                Đơn mới nhất
                            </h2>
                            <Link
                                href="/admin/orders"
                                className="text-sm text-[#f48120] font-bold hover:underline flex items-center"
                            >
                                Xem tất cả{" "}
                                <ArrowRight size={16} className="ml-1" />
                            </Link>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                            {data.recentOrders.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center">
                                    Chưa có đơn hàng nào.
                                </p>
                            ) : (
                                data.recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition border border-transparent hover:border-gray-100"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#f48120]">
                                                <ShoppingBag size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">
                                                    #{order.id}
                                                </p>
                                                <p className="text-xs text-gray-500 line-clamp-1">
                                                    {order.full_name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">
                                                {parseInt(
                                                    order.total
                                                ).toLocaleString()}
                                                đ
                                            </p>
                                            <span
                                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold capitalize 
                                                ${
                                                    order.status === "completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : order.status ===
                                                          "pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
