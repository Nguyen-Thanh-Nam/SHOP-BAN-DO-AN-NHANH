const crypto = require("crypto");
const db = require("../config/db");

class OrderModel {
    static async createOrder(connection, data) {
        const orderId = `ORD${crypto.randomUUID()}`.toUpperCase().replaceAll("-", "");

        const sql = `
            INSERT INTO orders 
            (id, user_id, full_name, phone_number, address, note, subtotal, shipping_fee, discount_amount, total, payment_method, coupon_code, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.execute(sql, [
            orderId,
            data.user_id || null,
            data.full_name,
            data.phone_number,
            data.address,
            data.note,
            data.subtotal,
            data.shipping_fee,
            data.discount_amount,
            data.total,
            data.payment_method || "cod",
            data.coupon_code || null,
            "pending",
        ]);

        return orderId;
    }

    static async createOrderItem(connection, orderId, item) {
        const sql = `
            INSERT INTO order_items 
            (order_id, product_id, product_name, product_image, quantity, unit_price, total_price, options)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const itemTotal = item.unitPrice * item.quantity;

        await connection.execute(sql, [
            orderId,
            item.id,
            item.title,
            item.image,
            item.quantity,
            item.unitPrice,
            itemTotal,
            JSON.stringify(item.selectedOptions || {}),
        ]);
    }

    static async findById(orderId) {
        const sql = `SELECT * FROM orders WHERE id = ?`;
        const [rows] = await db.execute(sql, [orderId]);
        return rows[0];
    }

    static async updatePaymentStatus(orderId, status, paymentMethod) {
        const sql = `
            UPDATE orders 
            SET status = ?, payment_method = ?, updated_at = NOW() 
            WHERE id = ?
        `;
        const [result] = await db.execute(sql, [
            status,
            paymentMethod,
            orderId,
        ]);
        return result.affectedRows > 0;
    }

    static async getAll() {
        const sql = `SELECT * FROM orders ORDER BY created_at DESC`;
        const [rows] = await db.execute(sql);
        return rows;
    }

    static async getItemsByOrderId(orderId) {
        const sql = `SELECT * FROM order_items WHERE order_id = ?`;
        const [rows] = await db.execute(sql, [orderId]);
        return rows;
    }

    static async updateStatus(orderId, status) {
        const sql = `UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?`;
        const [result] = await db.execute(sql, [status, orderId]);
        return result.affectedRows > 0;
    }

    static async findByPhone(phone) {
        const sql = `SELECT * FROM orders WHERE phone_number = ? ORDER BY created_at DESC`;
        const [rows] = await db.execute(sql, [phone]);
        return rows;
    }
}

module.exports = OrderModel;
