const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const sendEmail = require("../config/email");

class UserService {
    static async getAllUsers() {
        return await UserModel.getAll();
    }

    static async getUserDetail(id) {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new Error("Người dùng không tồn tại");
        }
        return user;
    }

    static async updateUser(id, data) {
        const existingUser = await UserModel.findById(id);
        if (!existingUser) {
            throw new Error("Người dùng không tồn tại");
        }

        const validRoles = ["user", "admin", "staff"];
        if (data.role && !validRoles.includes(data.role)) {
            throw new Error("Vai trò không hợp lệ");
        }

        const validGenders = ["Male", "Female", "Other"];
        if (data.gender && !validGenders.includes(data.gender)) {
            throw new Error("Giới tính không hợp lệ (Male, Female, Other)");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const updateData = {
            full_name: data.full_name || existingUser.full_name,
            phone: data.phone || existingUser.phone,
            email: data.email || existingUser.email,
            gender: data.gender || existingUser.gender || "Other",
            birthday:
                data.birthday !== undefined
                    ? data.birthday
                    : existingUser.birthday,
            role: data.role || existingUser.role,
            is_active: data.is_active === true || data.is_active == 1 ? 1 : 0,
            password:
                data.password !== undefined
                    ? hashedPassword
                    : existingUser.password,
        };

        await UserModel.update(id, updateData);
        return { message: "Cập nhật thành công", userId: id };
    }

    static async deleteUser(id) {
        const user = await UserModel.findById(id);
        if (!user) throw new Error("Người dùng không tồn tại");

        await UserModel.delete(id);
        return true;
    }
}

module.exports = UserService;
