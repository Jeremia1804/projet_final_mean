const mongoose = require("mongoose");

const categoryServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    img: { type: String, required: false },
  });

class CategoryServiceModel extends mongoose.model("CategoryService", categoryServiceSchema) {}
  

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "CategoryService", required: true },
  standard_price: { type: Number, required: true },
  img: { type: String, required: false },
});

class ServiceModel extends mongoose.model("Service", serviceSchema) {}


 module.exports = {CategoryServiceModel, ServiceModel};
  