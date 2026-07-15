const db = require("../config/db");

class CartModel {
    static async findByUserId(userId) {
        const [rows] = await db.execute(
            "SELECT * FROM carts WHERE user_id = ?",
            [userId]
        );
        return rows[0];
    }

    static async create(userId) {
        const [result] = await db.execute(
            "INSERT INTO carts (user_id) VALUES (?)",
            [userId]
        );
        return result.insertId;
    }

    static async getItems(cartId) {
        const sql = `
            SELECT ci.*, p.name, p.image 
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = ?
        `;
        const [rows] = await db.execute(sql, [cartId]);
        return rows;
    }

    static async findItem(cartId, itemCartId) {
        const sql =
            "SELECT * FROM cart_items WHERE cart_id = ? AND cart_item_id = ?";
        const [rows] = await db.execute(sql, [cartId, itemCartId]);
        return rows[0];
    }

    static async createItem(data) {
        const sql = `
            INSERT INTO cart_items (cart_id, product_id, cart_item_id, quantity, price, options)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [
            data.cart_id,
            data.product_id,
            data.cart_item_id,
            data.quantity,
            data.price,
            JSON.stringify(data.options),
        ]);
        return result.insertId;
    }

    static async updateItemQuantity(id, quantity) {
        const [result] = await db.execute(
            "UPDATE cart_items SET quantity = ? WHERE id = ?",
            [quantity, id]
        );
        return result.affectedRows > 0;
    }

    static async removeItem(cartId, itemCartId) {
        const [result] = await db.execute(
            "DELETE FROM cart_items WHERE cart_id = ? AND cart_item_id = ?",
            [cartId, itemCartId]
        );
        return result.affectedRows > 0;
    }

    static async clearCart(cartId) {
        const [result] = await db.execute(
            "DELETE FROM cart_items WHERE cart_id = ?",
            [cartId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = CartModel;
