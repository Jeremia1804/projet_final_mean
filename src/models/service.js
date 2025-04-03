const mongoose = require("mongoose");

const categoryServiceSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    img: { type: String, required: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
    });

categoryServiceSchema.virtual('services', {
    ref: 'Service',
    localField: '_id',
    foreignField: 'category_id'
});

categoryServiceSchema.virtual('id').get(function () {
    return this._id.toString();
});
class CategoryServiceModel extends mongoose.model("CategoryService", categoryServiceSchema) {
    static async importData(jsonData) {
        const results = { inserted: 0, updated: 0, errors: [] };

        for (const item of jsonData) {
            try {
                const { id, name, description, img } = item;

                if (!name) {
                    results.errors.push({ item, error: "Missing name field" });
                    continue;
                }

                if (id) {
                    const existingCategory = await this.findById(id);
                    if (existingCategory) {
                        existingCategory.name = name;
                        existingCategory.description = description || existingCategory.description;
                        existingCategory.img = img || existingCategory.img;
                        await existingCategory.save();
                        results.updated++;
                    } else {
                        results.errors.push({ item, error: "Category with given ID not found" });
                    }
                } else {
                    await this.create({ name, description, img });
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
  duration: { type: Number, required: true, default: 30 },
  active: { type: Boolean, default: true }
},
{
toJSON: { virtuals: true },
toObject: { virtuals: true }
});

serviceSchema.virtual('id').get(function () {
    return this._id.toString();
});

serviceSchema.virtual("prices", {
    ref: "PriceService",
    localField: "_id",
    foreignField: "service",
});

serviceSchema.virtual("min_price").get(function () {
    if (!this.prices || this.prices.length === 0) {
      return null;
    }
    return Math.min(...this.prices.map(p => p.price));
  });

class ServiceModel extends mongoose.model("Service", serviceSchema) {
    static async importData(jsonData) {
        const results = { inserted: 0, updated: 0, errors: [] };

        for (const item of jsonData) {
            try {
                const { id, name, description, category_name, standard_price, img, duration, active } = item;

                if (!name || !category_name || !standard_price) {
                    results.errors.push({ item, error: "Missing required fields (name, category_name, or standard_price)" });
                    continue;
                }

                const category = await CategoryServiceModel.findOne({ name: category_name });
                if (!category) {
                    results.errors.push({ item, error: "Category not found" });
                    continue;
                }

                if (id) {
                    const existingService = await this.findById(id);
                    if (existingService) {
                        existingService.name = name;
                        existingService.description = description || existingService.description;
                        existingService.category_id = category._id;
                        existingService.standard_price = standard_price;
                        existingService.img = img || existingService.img;
                        existingService.duration = duration || existingService.duration;
                        existingService.active = active !== undefined ? active : existingService.active;
                        await existingService.save();
                        results.updated++;
                    } else {
                        results.errors.push({ item, error: "Service with given ID not found" });
                    }
                } else {
                    await this.create({ name, description, category_id: category._id, standard_price, img, duration, active });
                    results.inserted++;
                }
            } catch (err) {
                results.errors.push({ item, error: err.message });
            }
        }

        return results;
    }
}


 module.exports = {CategoryServiceModel, ServiceModel};  