const db = require("../config/db");

class AddressModel {
    static async getAllByUserId(userId) {
        const sql =
            "SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC";
        const [rows] = await db.execute(sql, [userId]);
        return rows;
    }

    static async findById(id) {
        const sql = "SELECT * FROM user_addresses WHERE id = ?";
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }

    static async create(data) {
        const {
            user_id,
            address_name,
            full_address,
            recipient_name,
            recipient_email,
            recipient_phone,
            is_default,
        } = data;
        const sql = `
            INSERT INTO user_addresses 
            (user_id, address_name, full_address, recipient_name, recipient_email, recipient_phone, is_default) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [
            user_id,
            address_name,
            full_address,
            recipient_name,
            recipient_email,
            recipient_phone,
            is_default,
        ]);
        return result.insertId;
    }

    static async update(id, data) {
        const {
            address_name,
            full_address,
            recipient_name,
            recipient_email,
            recipient_phone,
            is_default,
        } = data;
        const sql = `
            UPDATE user_addresses 
            SET address_name = ?, full_address = ?, recipient_name = ?, recipient_email = ?, recipient_phone = ?, is_default = ?
            WHERE id = ?
        `;
        const [result] = await db.execute(sql, [
            address_name,
            full_address,
            recipient_name,
            recipient_email,
            recipient_phone,
            is_default,
            id,
        ]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const sql = "DELETE FROM user_addresses WHERE id = ?";
        await db.execute(sql, [id]);
    }

    static async clearDefault(userId) {
        const sql =
            "UPDATE user_addresses SET is_default = 0 WHERE user_id = ?";
        await db.execute(sql, [userId]);
    }
}

module.exports = AddressModel;
