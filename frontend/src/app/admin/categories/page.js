"use client";
import React, { useEffect, useState, useRef } from "react";
import { CategoryService } from "@/services/categoryService";
import {
    Plus,
    Trash2,
    Edit,
    X,
    UploadCloud,
    Loader2,
    Search,
    ChevronLeft,
    ChevronRight,
    Tag,
} from "lucide-react";
import { toast } from "react-toastify";
import AuthGuard from "@/components/auth/AuthGuard";

export default function CategoryManagementPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState("");
    const [isActive, setIsActive] = useState(1);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    const fetchCategories = async () => {
        try {
            const res = await CategoryService.getAll();
            setCategories(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredCategories.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const getImageUrl = (path) => {
        if (!path) return "https://placehold.co/100?text=No+Img";
        return path.startsWith("/uploads")
            ? `${(process.env.NEXT_PUBLIC_API_URL || "").replace("/api", "")}${path}`
            : path;
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingId(category.id);
            setName(category.name);
            setIsActive(category.is_active);
            setPreviewImage(getImageUrl(category.image));
            setImageFile(null);
        } else {
            setEditingId(null);
            setName("");
            setIsActive(1);
            setPreviewImage(null);
            setImageFile(null);
        }
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) return toast.info("Vui lòng nhập tên danh mục");

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("is_active", isActive ? 1 : 0);
            if (imageFile) formData.append("image", imageFile);

            if (editingId) await CategoryService.update(editingId, formData);
            else await CategoryService.create(formData);

            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            toast.info(error.response?.data?.message || "Lỗi xử lý");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (
            !confirm(
                "Xóa danh mục này sẽ ảnh hưởng đến các sản phẩm bên trong. Tiếp tục?"
            )
        )
            return;
        try {
            await CategoryService.delete(id);
            fetchCategories();
        } catch (error) {
            toast.info("Xóa thất bại");
        }
    };

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <div className="min-h-screen bg-gray-50/50 p-8 flex-1 flex flex-col">
                <div className="w-full space-y-8 flex-1 flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                Quản lý danh mục
                            </h1>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <div className="relative group w-full sm:w-72">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search
                                        size={18}
                                        className="text-gray-400 group-focus-within:text-[#f48120] transition-colors"
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Tìm danh mục..."
                                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f48120]/20 focus:border-[#f48120] transition-all shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            <button
                                onClick={() => openModal()}
                                className="bg-[#f48120] text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#d96e17] transition shadow-lg shadow-orange-200 whitespace-nowrap"
                            >
                                <Plus size={20} /> Thêm mới
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[20px] shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1 min-h-[400px]">
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/80 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                    <tr>
                                        <th className="p-6">Hình ảnh</th>
                                        <th className="p-6">Tên danh mục</th>
                                        <th className="p-6">Trạng thái</th>
                                        <th className="p-6 text-right">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="p-12 text-center text-gray-500"
                                            >
                                                Đang tải dữ liệu...
                                            </td>
                                        </tr>
                                    ) : currentData.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="p-12 text-center text-gray-500"
                                            >
                                                Không tìm thấy danh mục nào.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentData.map((cat) => (
                                            <tr
                                                key={cat.id}
                                                className="hover:bg-gray-50/80 transition-colors group"
                                            >
                                                <td className="p-6">
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white p-1">
                                                        <img
                                                            src={getImageUrl(
                                                                cat.image
                                                            )}
                                                            alt={cat.name}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="font-bold text-gray-800 text-base">
                                                        {cat.name}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                        <Tag size={10} />{" "}
                                                        {cat.slug}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                                            cat.is_active
                                                                ? "bg-green-50 text-green-700 border border-green-100"
                                                                : "bg-gray-100 text-gray-500 border border-gray-200"
                                                        }`}
                                                    >
                                                        <span
                                                            className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                                                cat.is_active
                                                                    ? "bg-green-500"
                                                                    : "bg-gray-400"
                                                            }`}
                                                        ></span>
                                                        {cat.is_active
                                                            ? "Hiển thị"
                                                            : "Đã ẩn"}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() =>
                                                                openModal(cat)
                                                            }
                                                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-[#f48120] hover:border-[#f48120] transition shadow-sm"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    cat.id
                                                                )
                                                            }
                                                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-red-600 hover:border-red-200 transition shadow-sm"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 0 && (
                            <div className="mt-auto border-t border-gray-200 px-6 py-4 bg-gray-50/50 flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    Hiển thị{" "}
                                    <span className="font-bold text-gray-800">
                                        {startIndex + 1}-
                                        {Math.min(
                                            startIndex + itemsPerPage,
                                            filteredCategories.length
                                        )}
                                    </span>{" "}
                                    trong{" "}
                                    <span className="font-bold text-gray-800">
                                        {filteredCategories.length}
                                    </span>{" "}
                                    danh mục
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)
                                        }
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() =>
                                                handlePageChange(page)
                                            }
                                            className={`w-9 h-9 rounded-lg text-sm font-bold transition shadow-sm ${
                                                currentPage === page
                                                    ? "bg-[#f48120] text-white border border-[#f48120]"
                                                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() =>
                                            handlePageChange(currentPage + 1)
                                        }
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-extrabold text-xl text-gray-800">
                                    {editingId
                                        ? "Cập nhật danh mục"
                                        : "Thêm danh mục mới"}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-1 rounded-full hover:bg-gray-200 transition text-gray-500"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="p-6 space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Tên danh mục{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="Vd: Gà Rán, Burger..."
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-[#f48120]/10 focus:border-[#f48120] transition font-medium"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Hình ảnh
                                    </label>
                                    <div
                                        onClick={() =>
                                            fileInputRef.current.click()
                                        }
                                        className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-[#f48120] transition h-40 relative group overflow-hidden"
                                    >
                                        {previewImage ? (
                                            <>
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="h-full object-contain"
                                                />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                    <span className="text-white font-bold text-sm">
                                                        Thay đổi ảnh
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center text-gray-400 group-hover:text-[#f48120] transition-colors">
                                                <UploadCloud
                                                    size={32}
                                                    className="mx-auto mb-2"
                                                />
                                                <span className="text-sm font-medium">
                                                    Bấm để chọn ảnh
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>

                                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <span className="text-sm font-bold text-gray-700">
                                        Trạng thái hiển thị
                                    </span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={isActive == 1}
                                            onChange={(e) =>
                                                setIsActive(
                                                    e.target.checked ? 1 : 0
                                                )
                                            }
                                        />
                                        <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer transition-colors duration-300 ease-in-out peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5.5 after:w-5.5 after:shadow-sm after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition"
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-8 py-3 rounded-xl bg-[#f48120] text-white font-bold hover:bg-[#d96e17] transition flex items-center shadow-lg shadow-orange-200 disabled:bg-gray-300 disabled:shadow-none"
                                    >
                                        {submitting ? (
                                            <Loader2
                                                size={20}
                                                className="animate-spin mr-2"
                                            />
                                        ) : null}
                                        {editingId ? "Cập nhật" : "Thêm mới"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}
