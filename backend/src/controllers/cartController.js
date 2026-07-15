const CartService = require("../services/cartService");

class CartController {
    static async getCart(req, res) {
        try {
            const userId = req.user.id;
            const data = await CartService.getUserCart(userId);
            res.json({ message: "Lấy giỏ hàng thành công", data });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async addToCart(req, res) {
        try {
            const userId = req.user.id;
            const itemData = req.body;

            await CartService.addToCart(userId, itemData);
            res.json({ message: "Đã thêm vào giỏ hàng server" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async updateQuantity(req, res) {
        try {
            const userId = req.user.id;
            const { cartId, quantity } = req.body;

            await CartService.updateQuantity(userId, cartId, quantity);
            res.json({ message: "Cập nhật số lượng thành công" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async removeItem(req, res) {
        try {
            const userId = req.user.id;
            const { cartId } = req.params;

            await CartService.removeItem(userId, cartId);
            res.json({ message: "Đã xóa món khỏi giỏ hàng" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = CartController;
