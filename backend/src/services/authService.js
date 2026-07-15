const UserModel = require("../models/userModel");
const TokenModel = require("../models/tokenModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../config/email");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class AuthService {
    static getRefreshTokenExpiry() {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date;
    }

    static generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15m",
        });
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );
        return { accessToken, refreshToken };
    }

    static async register(data) {
        const { full_name, phone, email, password, gender, birthday } = data;

        const existingEmail = await UserModel.findByEmail(email);
        if (existingEmail) throw new Error("Email đã tồn tại");

        const existingPhone = await UserModel.findByPhone(phone);
        if (existingPhone) throw new Error("Số điện thoại đã tồn tại");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userId = await UserModel.create({
            full_name,
            phone,
            email,
            password: hashedPassword,
            gender,
            birthday,
        });

        return await UserModel.findById(userId);
    }

    static async login(data) {
        const { email, password } = data;

        const user = await UserModel.findByEmail(email);
        if (!user) throw new Error("Thông tin đăng nhập không chính xác");

        if (user.is_active === 0) throw new Error("Tài khoản đã bị khóa");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Thông tin đăng nhập không chính xác");

        const tokens = this.generateTokens({ id: user.id, role: user.role });

        await TokenModel.create(
            user.id,
            tokens.refreshToken,
            this.getRefreshTokenExpiry()
        );

        const { password: _, ...userInfo } = user;
        return { user: userInfo, tokens };
    }

    static async refreshToken(requestToken) {
        if (!requestToken) throw new Error("Refresh Token là bắt buộc");

        const storedToken = await TokenModel.findByToken(requestToken);
        if (!storedToken)
            throw new Error("Refresh Token không tồn tại hoặc đã bị thu hồi");

        let decoded;
        try {
            decoded = jwt.verify(
                requestToken,
                process.env.REFRESH_TOKEN_SECRET
            );
        } catch (err) {
            await TokenModel.deleteByToken(requestToken);
            throw new Error("Refresh Token hết hạn");
        }

        if (new Date() > new Date(storedToken.expires_at)) {
            await TokenModel.deleteByToken(requestToken);
            throw new Error("Refresh Token hết hạn");
        }

        await TokenModel.deleteByToken(requestToken);

        const newTokens = this.generateTokens({
            id: decoded.id,
            role: decoded.role,
        });
        await TokenModel.create(
            decoded.id,
            newTokens.refreshToken,
            this.getRefreshTokenExpiry()
        );

        return newTokens;
    }

    static async logout(refreshToken) {
        await TokenModel.deleteByToken(refreshToken);
    }

    static async getProfile(userId) {
        const user = await UserModel.findById(userId);
        if (!user) throw new Error("User không tìm thấy");
        return user;
    }

    static async updateProfile(userId, data) {
        const currentUser = await UserModel.findById(userId);
        if (!currentUser) throw new Error("User không tồn tại");

        let formattedBirthday = currentUser.birthday;
        if (data.birthDay && data.birthMonth && data.birthYear) {
            formattedBirthday = `${data.birthYear}-${data.birthMonth}-${data.birthDay}`;
        }

        const updateData = {
            full_name: data.full_name || currentUser.full_name,
            gender: data.gender || currentUser.gender,
            birthday: formattedBirthday,
            avatar: data.avatar || currentUser.avatar,
        };
        console.log(data);

        await UserModel.update(userId, updateData);

        return await UserModel.findById(userId);
    }

    static async changePassword(userId, { currentPassword, newPassword }) {
        const user = await UserModel.findUserWithPassword(userId);

        if (!user) throw new Error("Người dùng không tồn tại");

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new Error("Mật khẩu hiện tại không chính xác");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await UserModel.update(userId, { password: hashedPassword });

        return true;
    }
    static async forgotPassword(email) {
        const user = await UserModel.findByEmail(email);
        if (!user) throw new Error("Email không tồn tại trong hệ thống");

        const resetToken = crypto.randomBytes(32).toString("hex");

        const expiry = new Date(Date.now() + 15 * 60 * 1000);

        await UserModel.saveResetToken(email, resetToken, expiry);

        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        const message = `
            <h1>Yêu cầu đặt lại mật khẩu</h1>
            <p>Bạn vừa yêu cầu đặt lại mật khẩu. Vui lòng click vào link dưới đây:</p>
            <a href="${resetUrl}" style="background:#f48120; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Đặt lại mật khẩu</a>
            <p>Link này sẽ hết hạn sau 15 phút.</p>
        `;

        await sendEmail(email, "Đặt lại mật khẩu", message);
        return true;
    }

    static async resetPassword(token, newPassword) {
        const user = await UserModel.findByResetToken(token);
        if (!user) throw new Error("Link không hợp lệ hoặc đã hết hạn");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await UserModel.update(user.id, { password: hashedPassword });

        await UserModel.clearResetToken(user.id);

        return true;
    }
}

module.exports = AuthService;
