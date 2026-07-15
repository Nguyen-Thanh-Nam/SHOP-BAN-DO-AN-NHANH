const BannerModel = require("../models/bannerModel");

class BannerService {
    static async getForHome() {
        return await BannerModel.getHomeBanners();
    }

    static async getAll() {
        return await BannerModel.getAll();
    }

    static async create(data) {
        return await BannerModel.create(data);
    }

    static async update(id, data) {
        return await BannerModel.update(id, data);
    }

    static async delete(id) {
        return await BannerModel.delete(id);
    }
}

module.exports = BannerService;
