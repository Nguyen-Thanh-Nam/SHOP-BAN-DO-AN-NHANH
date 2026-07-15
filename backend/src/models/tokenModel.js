const db = require("../config/db");

class TokenModel {
    static async create(userId, token, expiresAt) {
        const sql =
            "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)";
        await db.execute(sql, [userId, token, expiresAt]);
    }

    static async findByToken(token) {
        const sql = "SELECT * FROM refresh_tokens WHERE token = ?";
        const [rows] = await db.execute(sql, [token]);
        return rows[0];
    }

    static async deleteByToken(token) {
        const sql = "DELETE FROM refresh_tokens WHERE token = ?";
        await db.execute(sql, [token]);
    }

    static async deleteAllByUser(userId) {
        const sql = "DELETE FROM refresh_tokens WHERE user_id = ?";
        await db.execute(sql, [userId]);
    }
}

module.exports = TokenModel;
