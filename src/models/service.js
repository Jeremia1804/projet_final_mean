const mongoose = require("mongoose");

const categoryServiceSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    img: { type: String, required: false },
  });

class CategoryServiceModel extends mongoose.model("CategoryService", categoryServiceSchema) {
    static async importData(jsonData) {
        const results = { inserted: 0, updated: 0, errors: [] };

        for (const item of jsonData) {
            try {
                const { id, name, description } = item;

                if (!name) {
                    results.errors.push({ item, error: "Missing name field" });
                    continue;
                }

                if (id) {
                    const existingCategory = await this.findById(id);
                    if (existingCategory) {
                        existingCategory.name = name;
                        existingCategory.description = description || existingCategory.description;
                        await existingCategory.save();
                        results.updated++;
                    } else {
                        results.errors.push({ item, error: "Category with given ID not found" });
                    }
                } else {
                    await this.create({ name, description });
                    results.inserted++;
                }
            } catch (err) {
                results.errors.push({ item, error: err.message });
            }
        }

        return results;
    }
}
  

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true  },
  description: { type: String, required: false },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "CategoryService", required: true },
  standard_price: { type: Number, required: true },
  img: { type: String, required: false },
});

class ServiceModel extends mongoose.model("Service", serviceSchema) {}


 module.exports = {CategoryServiceModel, ServiceModel};  