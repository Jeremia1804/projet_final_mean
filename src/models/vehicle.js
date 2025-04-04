const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  country: { type: String },
  foundedYear: { type: Number },
  active: { type: Boolean, default: true }
});

class BrandModel extends mongoose.model("Brand", brandSchema){
  static async importData (jsonData) {
    const results = { inserted: 0, updated: 0, errors: [] };
  
    for (const item of jsonData) {
      try {
        const { id, name, country, foundedYear } = item;
  
        if (!name) {
          results.errors.push({ item, error: "Missing required field: name" });
          continue;
        }
  
        if (id) {
          const existing = await this.findById(id);
          if (existing) {
            existing.name = name;
            existing.country = country || existing.country;
            existing.foundedYear = foundedYear || existing.foundedYear;
            await existing.save();
            results.updated++;
          } else {
            results.errors.push({ item, error: `Brand with ID ${id} not found` });
          }
        } else {
          await this.create({ name, country, foundedYear });
          results.inserted++;
        }
      } catch (err) {
        results.errors.push({ item, error: err.message });
      }
    }
  
    return results;
  };
}

const modelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
  fuelType: { type: String, enum: ["Essence", "Diesel", "Électrique", "Hybride"], required: true },
  horsepower: { type: Number, required: true },
  year: { type: Number, required: true },
  active: { type: Boolean, default: true }
});

class ModelModel extends mongoose.model("Model", modelSchema){
  static async importData(jsonData) {
    const results = { inserted: 0, updated: 0, errors: [] };

    for (const item of jsonData) {
      try {
        const { id, name, brand_name, fuelType, horsepower, year } = item;

        if (!name || !brand_name || !fuelType || !horsepower || !year) {
          results.errors.push({
            item,
            error: "Missing required fields (name, brand_name, fuelType, horsepower, or year)",
          });
          continue;
        }

        const brand = await BrandModel.findOne({ name: brand_name });
        if (!brand) {
          results.errors.push({ item, error: `Brand not found: ${brand_name}` });
          continue;
        }

        if (id) {
          const existingModel = await this.findById(id);
          if (existingModel) {
            existingModel.name = name;
            existingModel.brand = brand._id;
            existingModel.fuelType = fuelType;
            existingModel.horsepower = horsepower;
            existingModel.year = year;
            await existingModel.save();
            results.updated++;
          } else {
            results.errors.push({ item, error: "Model with given ID not found" });
          }
        } else {
          await this.create({
            name,
            brand: brand._id,
            fuelType,
            horsepower,
            year,
          });
          results.inserted++;
        }
      } catch (err) {
        results.errors.push({ item, error: err.message });
      }
    }

    return results;
  }
}

const carSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  model: { type: mongoose.Schema.Types.ObjectId, ref: "Model", required: true },
  registrationNumber: { type: String, required: true, unique: true },
  color: { type: String },
  mileage: { type: Number },
  active: { type: Boolean, default: true }
});

const CarModel = mongoose.model("Car", carSchema);

module.exports = { BrandModel, ModelModel, CarModel };
