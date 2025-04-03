const mongoose = require("mongoose");
const { ServiceModel } = require("./service");
const { ModelModel } = require("./vehicle");

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

  static async importData(jsonData) {
    const results = { inserted: 0, updated: 0, errors: [] };

    for (const item of jsonData) {
        try {
            const { service_name, model_name, price } = item;

            if (!service_name || !model_name || !price) {
                results.errors.push({ item, error: "Missing required fields (service_name, model_name, or price)" });
                continue;
            }

            const service = await ServiceModel.findOne({ name: service_name });
            const model = await ModelModel.findOne({ name: model_name });

            if (!service) {
                results.errors.push({ item, error: `Service not found: ${service_name}` });
                continue;
            }
            if (!model) {
                results.errors.push({ item, error: `Model not found: ${model_name}` });
                continue;
            }

            let priceService = await PriceServiceModel.findOne({ service: service._id, model: model._id });

            if (priceService) {
                priceService.price = price;
                await priceService.save();
                results.updated++;
            } else {
                await PriceServiceModel.create({ service: service._id, model: model._id, price });
                results.inserted++;
            }
        } catch (err) {
            results.errors.push({ item, error: err.message });
        }
    }

    return results;
}

}

module.exports = PriceServiceModel ;
