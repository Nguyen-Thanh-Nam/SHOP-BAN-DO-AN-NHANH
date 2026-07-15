const CategoryModel = require("../models/categoryModel");
const slugify = require("slugify");

class CategoryService {
    static async getAll() {
        return await CategoryModel.getAll();
    }

    static async getDetail(id) {
        const category = await CategoryModel.getById(id);
        if (!category) throw new Error("Danh mục không tồn tại");
        return category;
    }

    static async create(data) {
        const slug = slugify(data.name, { lower: true, locale: "vi" });
        return await CategoryModel.create({ ...data, slug });
    }

    static async update(id, data) {
        if (data.name) {
            data.slug = slugify(data.name, { lower: true, locale: "vi" });
        }
        return await CategoryModel.update(id, data);
    }

    static async delete(id) {
        return await CategoryModel.delete(id);
    }
}

module.exports = CategoryService;
