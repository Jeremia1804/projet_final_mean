const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  country: { type: String },
  foundedYear: { type: Number },
});

const BrandModel = mongoose.model("Brand", brandSchema);

const modelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
  fuelType: { type: String, enum: ["Essence", "Diesel", "Électrique", "Hybride"], required: true },
  horsepower: { type: Number, required: true },
  year: { type: Number, required: true },
});

const ModelModel = mongoose.model("Model", modelSchema);

const carSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  model: { type: mongoose.Schema.Types.ObjectId, ref: "Model", required: true },
  registrationNumber: { type: String, required: true, unique: true },
  color: { type: String },
  mileage: { type: Number },
});

const CarModel = mongoose.model("Car", carSchema);

module.exports = { BrandModel, ModelModel, CarModel };
