const UserService = require("../services/userService");

class UserController {
    static async getAll(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.json({ data: users });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getDetail(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserDetail(id);
            res.json(user);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const {
                full_name,
                phone,
                email,
                gender,
                birthday,
                role,
                is_active,
                password,
            } = req.body;

            const updateData = {
                full_name,
                phone,
                email,
                gender,
                birthday,
                role,
                is_active,
                password,
            };

            const result = await UserService.updateUser(id, updateData);
            res.json(result);
        } catch (error) {
            if (error.message.includes("không tồn tại")) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(400).json({ message: error.message });
            }
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await UserService.deleteUser(id);
            res.json({ message: "Đã xóa người dùng" });
        } catch (error) {
            if (error.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(400).json({
                    message: "Không thể xóa user này do có dữ liệu liên quan.",
                });
            }
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = UserController;
