const StoreModel = require("../models/storeModel");

class StoreService {
    static async getAllStores() {
        return await StoreModel.getAll();
    }

    static async getStoreDetail(id) {
        const store = await StoreModel.getById(id);
        if (!store) {
            throw new Error("Cửa hàng không tồn tại");
        }
        return store;
    }

    static async createStore(data) {
        if (!data.name || !data.address) {
            throw new Error("Tên cửa hàng và địa chỉ là bắt buộc");
        }
        return await StoreModel.create(data);
    }

    static async updateStore(id, data) {
        const store = await StoreModel.getById(id);
        if (!store) {
            throw new Error("Cửa hàng không tồn tại để cập nhật");
        }
        return await StoreModel.update(id, data);
    }

    static async deleteStore(id) {
        const store = await StoreModel.getById(id);
        if (!store) {
            throw new Error("Cửa hàng không tồn tại để xóa");
        }
        return await StoreModel.delete(id);
    }
}

module.exports = StoreService;
