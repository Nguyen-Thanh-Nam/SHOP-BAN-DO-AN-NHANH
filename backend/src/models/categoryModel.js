const db = require("../config/db");

class CategoryModel {
    static async getAll() {
        const [rows] = await db.execute(
            "SELECT * FROM categories ORDER BY created_at DESC"
        );
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM categories WHERE id = ?",
            [id]
        );
        return rows[0];
    }

    static async create(data) {
        const { name, slug, image } = data;
        const sql =
            "INSERT INTO categories (name, slug, image, is_active) VALUES (?, ?, ?, 1)";
        const [result] = await db.execute(sql, [name, slug, image]);
        return result.insertId;
    }

    static async update(id, data) {
        const fields = [];
        const values = [];

        if (data.name) {
            fields.push("name = ?");
            values.push(data.name);
        }
        if (data.slug) {
            fields.push("slug = ?");
            values.push(data.slug);
        }
        if (data.image) {
            fields.push("image = ?");
            values.push(data.image);
        }
        if (data.is_active !== undefined) {
            fields.push("is_active = ?");
            values.push(data.is_active);
        }

        if (fields.length === 0) return true;

        values.push(id);
        const sql = `UPDATE categories SET ${fields.join(", ")} WHERE id = ?`;
        const [result] = await db.execute(sql, values);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute(
            "DELETE FROM categories WHERE id = ?",
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = CategoryModel;
