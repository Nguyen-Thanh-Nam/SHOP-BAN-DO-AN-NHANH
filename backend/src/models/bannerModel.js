const db = require("../config/db");

class BannerModel {
    static async getHomeBanners() {
        const sql = `
            SELECT b.*, p.slug as promotion_slug 
            FROM banners b
            LEFT JOIN promotions p ON b.promotion_id = p.id
            WHERE b.is_active = 1
            ORDER BY b.created_at DESC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }

    static async getAll() {
        const [rows] = await db.execute(
            "SELECT * FROM banners ORDER BY created_at DESC"
        );
        return rows;
    }

    static async create(data) {
        const { title, image_desktop, image_mobile, promotion_id, is_active } =
            data;
        const sql = `
            INSERT INTO banners (title, image_desktop, image_mobile, promotion_id, is_active)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [
            title,
            image_desktop,
            image_mobile,
            promotion_id,
            is_active,
        ]);
        return result.insertId;
    }

    static async update(id, data) {
        const fields = [];
        const values = [];
        [
            "title",
            "image_desktop",
            "image_mobile",
            "promotion_id",
            "is_active",
        ].forEach((field) => {
            if (data[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(data[field]);
            }
        });

        if (fields.length === 0) return;
        values.push(id);
        await db.execute(
            `UPDATE banners SET ${fields.join(", ")} WHERE id = ?`,
            values
        );
    }

    static async delete(id) {
        await db.execute("DELETE FROM banners WHERE id = ?", [id]);
    }
}

module.exports = BannerModel;
