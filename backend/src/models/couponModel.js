const db = require("../config/db");

const toMySQLDate = (isoDate) => {
    if (!isoDate) return null;
    return new Date(isoDate).toISOString().slice(0, 19).replace("T", " ");
};

class CouponModel {
    static async getAll() {
        const [rows] = await db.execute(
            "SELECT * FROM coupons ORDER BY created_at DESC"
        );
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute("SELECT * FROM coupons WHERE id = ?", [
            id,
        ]);
        return rows[0];
    }

    static async getByCode(code) {
        const [rows] = await db.execute(
            "SELECT * FROM coupons WHERE code = ?",
            [code]
        );
        return rows[0];
    }

    static async create(data) {
        const {
            code,
            description,
            discount_type,
            discount_value,
            min_order_value,
            max_discount_amount,
            start_date,
            end_date,
            usage_limit,
            is_active,
        } = data;
        const sql = `
            INSERT INTO coupons 
            (code, description, discount_type, discount_value, min_order_value, max_discount_amount, start_date, end_date, usage_limit, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [
            code.toUpperCase(),
            description,
            discount_type,
            discount_value,
            min_order_value || 0,
            max_discount_amount,
            toMySQLDate(start_date),
            toMySQLDate(end_date),
            usage_limit || 0,
            is_active !== undefined ? is_active : 1,
        ]);
        return result.insertId;
    }

    static async update(id, data) {
        const fields = [];
        const values = [];

        Object.keys(data).forEach((key) => {
            if (data[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(data[key]);
            }
        });

        if (fields.length === 0) return true;
        values.push(id);

        const sql = `UPDATE coupons SET ${fields.join(", ")} WHERE id = ?`;

        const [result] = await db.execute(sql, values);

        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute("DELETE FROM coupons WHERE id = ?", [
            id,
        ]);
        return result.affectedRows > 0;
    }

    static async incrementUsage(id) {
        await db.execute(
            "UPDATE coupons SET usage_count = usage_count + 1 WHERE id = ?",
            [id]
        );
    }
}

module.exports = CouponModel;
