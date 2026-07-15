const ProductModel = require("../models/productModel");
const slugify = require("slugify");

class ProductService {
    static async getAll(params) {
        return await ProductModel.getAll(params);
    }

    static async getDetail(id) {
        const product = await ProductModel.getById(id);
        if (!product) return null;

        const options = await ProductModel.getProductOptions(id);
        return { ...product, option_groups: options };
    }

    static async create(data) {
        const slug = slugify(data.name, { lower: true, locale: "vi" });

        const productId = await ProductModel.create({ ...data, slug });

        if (data.option_groups && Array.isArray(data.option_groups)) {
            await this._insertOptionGroups(productId, data.option_groups);
        }

        return productId;
    }

    static async update(id, data) {
        if (data.name) {
            data.slug = slugify(data.name, { lower: true, locale: "vi" });
        }
        await ProductModel.update(id, data);

        if (data.option_groups && Array.isArray(data.option_groups)) {
            await ProductModel.deleteAllOptions(id);
            await this._insertOptionGroups(id, data.option_groups);
        }

        return true;
    }

    static async delete(id) {
        return await ProductModel.delete(id);
    }

    static async _insertOptionGroups(productId, groups) {
        for (const group of groups) {
            const groupId = await ProductModel.createOptionGroup({
                product_id: productId,
                name: group.name,
                is_required: group.is_required || 0,
                min_select: group.min_select || 0,
                max_select: group.max_select || 1,
            });

            if (group.options && Array.isArray(group.options)) {
                for (const option of group.options) {
                    await ProductModel.createOption({
                        group_id: groupId,
                        name: option.name,
                        price_adjustment: option.price_adjustment || 0,
                        is_default: option.is_default || 0,
                    });
                }
            }
        }
    }
}

module.exports = ProductService;
