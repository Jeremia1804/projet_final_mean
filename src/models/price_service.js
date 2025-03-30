const mongoose = require("mongoose");

const PriceSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    model: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Model",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be greater than 0"]
    },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

class PriceServiceModel extends mongoose.model("PriceService", PriceSchema) {
  static async setPrice(service, model, price) {
    const existingPrice = await PriceServiceModel.findOne({ service, model });

    if (existingPrice) {
      existingPrice.price = price;
      return await existingPrice.save();
    } else {
      const newPrice = new PriceServiceModel({ service, model, price });
      return await newPrice.save();
    }
  }

  static async getAllPrices() {
    return await PriceServiceModel.find().populate("service").populate("model");
  }

  static async deletePrice(id) {
    return await PriceServiceModel.findByIdAndDelete(id);
  }
}

module.exports = PriceServiceModel ;
