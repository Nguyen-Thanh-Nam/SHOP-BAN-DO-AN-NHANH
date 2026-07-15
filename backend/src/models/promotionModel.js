const db = require("../config/db");

class PromotionModel {
    static async getActivePromotions(limit = null) {
        let sql = `
            SELECT * FROM promotions 
            WHERE is_active = 1 
            AND (start_date IS NULL OR start_date <= NOW())
            AND (end_date IS NULL OR end_date >= NOW())
            ORDER BY created_at DESC
        `;

        if (limit) {
            const limitVal = parseInt(limit);
            if (!isNaN(limitVal)) {
                sql += ` LIMIT ${limitVal}`;
            }
        }

        const [rows] = await db.execute(sql);
        return rows;
    }

    static async getAll() {
        const [rows] = await db.execute(
            "SELECT * FROM promotions ORDER BY created_at DESC"
        );
        return rows;
    }

    static async getBySlug(slug) {
        const sql = "SELECT * FROM promotions WHERE slug = ?";
        const [rows] = await db.execute(sql, [slug]);
        return rows[0];
    }

    static async getPromotionProducts(promotionId) {
        const sql = `
            SELECT p.id, p.name, p.price, p.image, p.description 
            FROM products p
            JOIN promotion_products pp ON p.id = pp.product_id
            WHERE pp.promotion_id = ? AND p.is_active = 1
        `;
        const [rows] = await db.execute(sql, [promotionId]);
        return rows;
    }

    static async create(data) {
        const {
            name,
            slug,
            image,
            description,
            start_date,
            end_date,
            valid_days,
            is_active,
        } = data;
        const sql = `
            INSERT INTO promotions (name, slug, image, description, start_date, end_date, valid_days, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [
            name,
            slug,
            image,
            description,
            start_date,
            end_date,
            valid_days,
            is_active,
        ]);
        return result.insertId;
    }

    static async addProducts(promotionId, productIds) {
        if (!productIds || productIds.length === 0) return;

        const placeholders = productIds.map(() => "(?, ?)").join(", ");
        const values = [];
        productIds.forEach((pid) => values.push(promotionId, pid));

        const sql = `INSERT INTO promotion_products (promotion_id, product_id) VALUES ${placeholders}`;
        await db.execute(sql, values);
    }

    static async removeAllProducts(promotionId) {
        await db.execute(
            "DELETE FROM promotion_products WHERE promotion_id = ?",
            [promotionId]
        );
    }

    static async update(id, data) {
        const fields = [];
        const values = [];
        [
            "name",
            "slug",
            "image",
            "description",
            "start_date",
            "end_date",
            "valid_days",
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
            `UPDATE promotions SET ${fields.join(", ")} WHERE id = ?`,
            values
        );
    }

    static async delete(id) {
        await db.execute("DELETE FROM promotions WHERE id = ?", [id]);
    }
}

module.exports = PromotionModel;
