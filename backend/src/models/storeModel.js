const db = require("../config/db");

class StoreModel {
    static async getAll() {
        const [rows] = await db.execute(
            "SELECT * FROM stores ORDER BY created_at DESC"
        );
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute("SELECT * FROM stores WHERE id = ?", [
            id,
        ]);
        return rows[0];
    }

    static async create(data) {
        const {
            name,
            address,
            phone,
            open_time,
            close_time,
            latitude,
            longitude,
            is_active,
        } = data;
        const sql = `
            INSERT INTO stores (name, address, phone, open_time, close_time, latitude, longitude, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [
            name,
            address,
            phone,
            open_time,
            close_time,
            latitude,
            longitude,
            is_active !== undefined ? is_active : 1,
        ]);
        return result.insertId;
    }

    static async update(id, data) {
        const fields = [];
        const values = [];

        if (data.name) {
            fields.push("name = ?");
            values.push(data.name);
        }
        if (data.address) {
            fields.push("address = ?");
            values.push(data.address);
        }
        if (data.phone) {
            fields.push("phone = ?");
            values.push(data.phone);
        }
        if (data.open_time) {
            fields.push("open_time = ?");
            values.push(data.open_time);
        }
        if (data.close_time) {
            fields.push("close_time = ?");
            values.push(data.close_time);
        }
        if (data.latitude) {
            fields.push("latitude = ?");
            values.push(data.latitude);
        }
        if (data.longitude) {
            fields.push("longitude = ?");
            values.push(data.longitude);
        }
        if (data.is_active !== undefined) {
            fields.push("is_active = ?");
            values.push(data.is_active);
        }

        if (fields.length === 0) return true;

        values.push(id);
        const sql = `UPDATE stores SET ${fields.join(", ")} WHERE id = ?`;

        const [result] = await db.execute(sql, values);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute("DELETE FROM stores WHERE id = ?", [
            id,
        ]);
        return result.affectedRows > 0;
    }
}

module.exports = StoreModel;
