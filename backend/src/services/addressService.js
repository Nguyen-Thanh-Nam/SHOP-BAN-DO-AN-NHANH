const AddressModel = require("../models/addressModel");

class AddressService {
    static async getList(userId) {
        return await AddressModel.getAllByUserId(userId);
    }

    static async addAddress(userId, data) {
        if (data.is_default === true || data.is_default === 1) {
            await AddressModel.clearDefault(userId);
        }

        const existing = await AddressModel.getAllByUserId(userId);
        if (existing.length === 0) {
            data.is_default = 1;
        }

        const newId = await AddressModel.create({ ...data, user_id: userId });
        return { id: newId, ...data };
    }

    static async updateAddress(userId, addressId, data) {
        const addr = await AddressModel.findById(addressId);
        if (!addr || addr.user_id !== userId)
            throw new Error(
                "Địa chỉ không tồn tại hoặc không có quyền truy cập"
            );

        if (data.is_default === true || data.is_default === 1) {
            await AddressModel.clearDefault(userId);
        }

        await AddressModel.update(addressId, data);
        return { id: addressId, ...data };
    }

    static async deleteAddress(userId, addressId) {
        const addr = await AddressModel.findById(addressId);
        if (!addr || addr.user_id !== userId)
            throw new Error(
                "Địa chỉ không tồn tại hoặc không có quyền truy cập"
            );

        await AddressModel.delete(addressId);
    }

    static async setDefault(userId, addressId) {
        const addr = await AddressModel.findById(addressId);
        if (!addr || addr.user_id !== userId)
            throw new Error("Lỗi quyền truy cập");

        await AddressModel.clearDefault(userId);

        await AddressModel.update(addressId, { ...addr, is_default: 1 });
    }
}

module.exports = AddressService;
