const PromotionModel = require("../models/promotionModel");
const slugify = require("slugify");

class PromotionService {
    static async getClientList(params = {}) {
        return await PromotionModel.getActivePromotions(params.limit);
    }

    static async getAdminList() {
        return await PromotionModel.getAll();
    }

    static async getDetail(slug) {
        const promo = await PromotionModel.getBySlug(slug);
        if (!promo) return null;

        const products = await PromotionModel.getPromotionProducts(promo.id);
        return { ...promo, products };
    }

    static async create(data) {
        const slug = slugify(data.name, { lower: true, locale: "vi" });
        const promoId = await PromotionModel.create({ ...data, slug });

        if (data.product_ids) {
            let ids = Array.isArray(data.product_ids)
                ? data.product_ids
                : JSON.parse(data.product_ids);
            await PromotionModel.addProducts(promoId, ids);
        }
        return promoId;
    }

    static async update(id, data) {
        if (data.name) {
            data.slug = slugify(data.name, { lower: true, locale: "vi" });
        }

        await PromotionModel.update(id, data);

        if (data.product_ids) {
            let ids = Array.isArray(data.product_ids)
                ? data.product_ids
                : JSON.parse(data.product_ids);
            await PromotionModel.removeAllProducts(id);
            await PromotionModel.addProducts(id, ids);
        }
    }

    static async delete(id) {
        return await PromotionModel.delete(id);
    }
}

module.exports = PromotionService;
