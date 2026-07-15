const db = require("../config/db");

class UserModel {
    static async getAll() {
        const sql = `
            SELECT id, full_name, phone, email, avatar, gender, birthday, role, is_active, created_at 
            FROM users WHERE role IN ('user', 'staff')
            ORDER BY created_at DESC    
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }

    static async findById(id) {
        const sql = `
            SELECT id, full_name, phone, email, avatar, gender, birthday, role, is_active, created_at 
            FROM users 
            WHERE id = ?
        `;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }

    static async findByEmail(email) {
        const sql = "SELECT * FROM users WHERE email = ?";
        const [rows] = await db.execute(sql, [email]);
        return rows[0];
    }

    static async findByPhone(phone) {
        const sql = "SELECT * FROM users WHERE phone = ?";
        const [rows] = await db.execute(sql, [phone]);
        return rows[0];
    }

    static async create(userData) {
        const { full_name, phone, email, password, gender, birthday, role } =
            userData;
        const sql = `
            INSERT INTO users (full_name, phone, email, password, gender, birthday, role) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const userRole = role || "user";
        const [result] = await db.execute(sql, [
            full_name,
            phone,
            email,
            password,
            gender,
            birthday,
            userRole,
        ]);
        return result.insertId;
    }

    static async update(id, data) {
        const keys = Object.keys(data);
        if (keys.length === 0) return false;

        const setClause = keys.map((key) => `${key} = ?`).join(", ");

        const values = Object.values(data);

        const sql = `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = ?`;

        values.push(id);

        const [result] = await db.execute(sql, values);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const sql = `DELETE FROM users WHERE id = ?`;
        const [result] = await db.execute(sql, [id]);
        return result.affectedRows > 0;
    }

    static async findUserWithPassword(id) {
        const sql = `SELECT id, password FROM users WHERE id = ?`;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }
    static async saveResetToken(email, token, expiry) {
        const sql = `UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?`;
        await db.execute(sql, [token, expiry, email]);
    }

    static async findByResetToken(token) {
        const sql = `SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()`;
        const [rows] = await db.execute(sql, [token]);
        return rows[0];
    }

    static async clearResetToken(id) {
        const sql = `UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = ?`;
        await db.execute(sql, [id]);
    }
}

module.exports = UserModel;
