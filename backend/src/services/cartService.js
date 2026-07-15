const CartModel = require("../models/cartModel");

class CartService {
    static async getUserCart(userId) {
        let cart = await CartModel.findByUserId(userId);

        if (!cart) return [];

        const items = await CartModel.getItems(cart.id);

        return items.map((item) => ({
            id: item.product_id,
            cartId: item.cart_item_id,
            title: item.name,
            image: item.image,
            unitPrice: parseFloat(item.price),
            quantity: item.quantity,
            selectedOptions:
                typeof item.options === "string"
                    ? JSON.parse(item.options)
                    : item.options,
        }));
    }

    static async addToCart(userId, itemData) {
        let cart = await CartModel.findByUserId(userId);
        if (!cart) {
            const newCartId = await CartModel.create(userId);
            cart = { id: newCartId };
        }

        const existingItem = await CartModel.findItem(cart.id, itemData.cartId);

        if (existingItem) {
            const newQuantity = existingItem.quantity + itemData.quantity;
            await CartModel.updateItemQuantity(existingItem.id, newQuantity);
        } else {
            await CartModel.createItem({
                cart_id: cart.id,
                product_id: itemData.id,
                cart_item_id: itemData.cartId,
                quantity: itemData.quantity,
                price: itemData.unitPrice,
                options: itemData.selectedOptions,
            });
        }

        return true;
    }

    static async updateQuantity(userId, cartItemId, quantity) {
        const cart = await CartModel.findByUserId(userId);
        if (!cart) throw new Error("Giỏ hàng không tồn tại");

        const item = await CartModel.findItem(cart.id, cartItemId);
        if (!item) throw new Error("Món ăn không tìm thấy trong giỏ");

        if (quantity <= 0) {
            return await CartModel.removeItem(cart.id, cartItemId);
        }

        return await CartModel.updateItemQuantity(item.id, quantity);
    }

    static async removeItem(userId, cartItemId) {
        const cart = await CartModel.findByUserId(userId);
        if (!cart) return false;

        return await CartModel.removeItem(cart.id, cartItemId);
    }
}

module.exports = CartService;
