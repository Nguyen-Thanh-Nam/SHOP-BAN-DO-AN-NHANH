const db = require("../config/db");

class ProductModel {
    static async getAll(options = {}) {
        let sql = "SELECT p.* FROM products p";
        const params = [];

        if (options.category_slug) {
            sql += " JOIN categories c ON p.category_id = c.id";
        }

        if (options.category_id) {
            sql += " AND p.category_id = ?";
            params.push(options.category_id);
        }

        if (options.category_slug) {
            sql += " AND c.slug = ?";
            params.push(options.category_slug);
        }

        sql += " ORDER BY p.created_at DESC";

        if (options.limit) {
            const limitVal = parseInt(options.limit);
            if (!isNaN(limitVal)) {
                sql += ` LIMIT ${limitVal}`;
            }
        }

        const [rows] = await db.execute(sql, params);
        return rows;
    }

    static async search(keyword) {
        const sql = `
            SELECT p.*, c.name as category_name, c.slug as category_slug 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = 1 
            AND (p.name LIKE ?)
            ORDER BY p.created_at DESC
        `;

        const [rows] = await db.execute(sql, [`%${keyword}%`]);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute("SELECT * FROM products WHERE id = ?", [
            id,
        ]);
        return rows[0];
    }

    static async getProductOptions(productId) {
        const [groups] = await db.execute(
            "SELECT * FROM product_option_groups WHERE product_id = ? ORDER BY id ASC",
            [productId]
        );
        if (groups.length === 0) return [];

        const groupIds = groups.map((g) => g.id);
        const placeholders = groupIds.map(() => "?").join(",");
        const [options] = await db.execute(
            `SELECT * FROM product_options WHERE group_id IN (${placeholders}) ORDER BY id ASC`,
            groupIds
        );

        return groups.map((group) => ({
            ...group,
            options: options.filter((opt) => opt.group_id === group.id),
        }));
    }

    static async create(data) {
        const {
            category_id,
            name,
            slug,
            description,
            price,
            original_price,
            image,
        } = data;
        const sql = `
            INSERT INTO products (category_id, name, slug, description, price, original_price, image, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `;
        const [result] = await db.execute(sql, [
            category_id,
            name,
            slug,
            description,
            price,
            original_price,
            image,
        ]);
        return result.insertId;
    }

    static async createOptionGroup(data) {
        const sql =
            "INSERT INTO product_option_groups (product_id, name, is_required, min_select, max_select) VALUES (?, ?, ?, ?, ?)";
        const [result] = await db.execute(sql, [
            data.product_id,
            data.name,
            data.is_required,
            data.min_select,
            data.max_select,
        ]);
        return result.insertId;
    }

    static async createOption(data) {
        const sql =
            "INSERT INTO product_options (group_id, name, price_adjustment, is_default) VALUES (?, ?, ?, ?)";
        await db.execute(sql, [
            data.group_id,
            data.name,
            data.price_adjustment,
            data.is_default,
        ]);
    }

    static async update(id, data) {
        const fields = [];
        const values = [];

        if (data.category_id) {
            fields.push("category_id = ?");
            values.push(data.category_id);
        }
        if (data.name) {
            fields.push("name = ?");
            values.push(data.name);
        }
        if (data.slug) {
            fields.push("slug = ?");
            values.push(data.slug);
        }
        if (data.description) {
            fields.push("description = ?");
            values.push(data.description);
        }
        if (data.price) {
            fields.push("price = ?");
            values.push(data.price);
        }
        if (data.original_price) {
            fields.push("original_price = ?");
            values.push(data.original_price);
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
        const sql = `UPDATE products SET ${fields.join(", ")} WHERE id = ?`;
        await db.execute(sql, values);
    }

    static async delete(id) {
        const [result] = await db.execute("DELETE FROM products WHERE id = ?", [
            id,
        ]);
        return result.affectedRows > 0;
    }

    static async deleteAllOptions(productId) {
        await db.execute(
            "DELETE FROM product_option_groups WHERE product_id = ?",
            [productId]
        );
    }
}

module.exports = ProductModel;
