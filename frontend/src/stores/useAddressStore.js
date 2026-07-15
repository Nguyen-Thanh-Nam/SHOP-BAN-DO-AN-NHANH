import { create } from "zustand";
import { AddressService } from "@/services/addressService";
import { toast } from "react-toastify";

const useAddressStore = create((set, get) => ({
    addresses: [],
    isLoading: false,
    error: null,

    fetchAddresses: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await AddressService.getList();
            set({ addresses: res.data, isLoading: false });
        } catch (err) {
            set({ isLoading: false, error: err.message });
        }
    },

    addAddress: async (data) => {
        set({ isLoading: true });
        try {
            await AddressService.create(data);
            await get().fetchAddresses();
            return { success: true };
        } catch (err) {
            set({ isLoading: false });
            return {
                success: false,
                error: err.response?.data?.message || "Lỗi thêm địa chỉ",
            };
        }
    },

    updateAddress: async (id, data) => {
        set({ isLoading: true });
        try {
            await AddressService.update(id, data);
            await get().fetchAddresses();
            return { success: true };
        } catch (err) {
            set({ isLoading: false });
            return {
                success: false,
                error: err.response?.data?.message || "Lỗi cập nhật",
            };
        }
    },

    setDefault: async (id) => {
        try {
            await AddressService.setDefault(id);
            await get().fetchAddresses();
        } catch (err) {
            console.error(err);
        }
    },

    deleteAddress: async (id) => {
        if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
        try {
            await AddressService.delete(id);
            set((state) => ({
                addresses: state.addresses.filter((addr) => addr.id !== id),
            }));
        } catch (err) {
            toast.info("Xóa thất bại");
        }
    },
}));

export default useAddressStore;
