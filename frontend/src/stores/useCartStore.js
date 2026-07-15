import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import useAuthStore from "./useAuthStore";
import { CartService } from "@/services/cartService";

const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            appliedCoupon: null,

            addToCart: async (product, quantity, selectedOptions) => {
                const user = useAuthStore.getState().user;
                const currentItems = get().items;

                const optionsString = JSON.stringify(selectedOptions);
                const cartId = `${product.id}-${optionsString}`;

                const parsePrice = (priceStr) => {
                    if (typeof priceStr === "number") return priceStr;
                    return (
                        parseInt(priceStr.toString().replace(/\D/g, "")) || 0
                    );
                };

                const newItem = {
                    ...product,
                    cartId,
                    selectedOptions,
                    quantity,
                    unitPrice: parsePrice(product.price),
                    originalPrice: product.original_price
                        ? parsePrice(product.original_price)
                        : 0,
                };

                const existingItem = currentItems.find(
                    (item) => item.cartId === cartId
                );
                let updatedItems;

                if (existingItem) {
                    updatedItems = currentItems.map((item) =>
                        item.cartId === cartId
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    updatedItems = [...currentItems, newItem];
                }
                set({ items: updatedItems, appliedCoupon: null });

                if (user) {
                    try {
                        await CartService.addToCart({ ...newItem, quantity });
                    } catch (error) {
                        console.error("Lỗi đồng bộ giỏ hàng:", error);
                    }
                }
            },

            updateQuantity: async (cartId, delta) => {
                const user = useAuthStore.getState().user;
                const currentItems = get().items;

                let newQty = 0;
                const updatedItems = currentItems.map((item) => {
                    if (item.cartId === cartId) {
                        newQty = Math.max(1, item.quantity + delta);
                        return { ...item, quantity: newQty };
                    }
                    return item;
                });

                set({ items: updatedItems, appliedCoupon: null });

                if (user) {
                    try {
                        await CartService.updateQuantity(cartId, newQty);
                    } catch (e) {
                        console.error(e);
                    }
                }
            },

            removeFromCart: async (cartId) => {
                const user = useAuthStore.getState().user;
                set({
                    items: get().items.filter((item) => item.cartId !== cartId),
                    appliedCoupon: null,
                });

                if (user) {
                    try {
                        await CartService.removeItem(cartId);
                    } catch (e) {
                        console.error(e);
                    }
                }
            },

            applyCoupon: (couponData) => {
                set({ appliedCoupon: couponData });
            },

            removeCoupon: () => {
                set({ appliedCoupon: null });
            },

            fetchCartFromDB: async () => {
                try {
                    const res = await CartService.getCart();
                    if (res.data) {
                        set({ items: res.data });
                    }
                } catch (error) {
                    console.error("Lỗi tải giỏ hàng từ DB", error);
                }
            },

            getTotalPrice: () => {
                return get().items.reduce(
                    (total, item) => total + item.unitPrice * item.quantity,
                    0
                );
            },

            getTotalItems: () => {
                return get().items.reduce(
                    (total, item) => total + item.quantity,
                    0
                );
            },

            clearCart: () => set({ items: [], appliedCoupon: null }),
        }),
        {
            name: "popeyes-cart-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useCartStore;
