const express = require("express");
const { BrandModel, ModelModel, CarModel } = require("../models/vehicle.js");
const { verifyToken, checkRole } = require('../middlewares/authMiddleware')
const router = express.Router();

// CRUD MARQUE (Brand)

router.post("/brands", verifyToken, checkRole("ADMIN"), async (req, res) => {
  try {
    const brand = new BrandModel(req.body);
    await brand.save();
    res.status(201).json(brand);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/brands", async (req, res) => {
  try {
    const brands = await BrandModel.find();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/brands/:id", async (req, res) => {
  try {
    const brand = await BrandModel.findById(req.params.id);
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/brands/:id", verifyToken, checkRole("ADMIN"), async (req, res) => {
  try {
    const brand = await BrandModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(brand);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/brands/:id", verifyToken, checkRole("ADMIN"), async (req, res) => {
  try {
    await BrandModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Brand deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  CRUD MODÈLE (Model)

router.post("/models", verifyToken, checkRole("ADMIN"), async (req, res) => {
  try {
    const model = new ModelModel(req.body);
    await model.save();
    res.status(201).json(model);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/models", async (req, res) => {
  try {
    const models = await ModelModel.find().populate("brand");
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/models/:id", async (req, res) => {
  try {
    const model = await ModelModel.findById(req.params.id).populate("brand");
    if (!model) return res.status(404).json({ error: "Model not found" });
    res.json(model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/models/:id", verifyToken, checkRole("ADMIN"), async (req, res) => {
  try {
    const model = await ModelModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(model);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/models/:id", verifyToken, checkRole("ADMIN"), async (req, res) => {
  try {
    await ModelModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Model deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CRUD VOITURE (Car)

router.post("/cars", verifyToken, async (req, res) => {
  try {
    const car = new CarModel(req.body);
    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/cars", verifyToken, checkRole("ADMIN"), async (req, res) => {
  try {
    const cars = await CarModel.find().populate("owner model");
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/cars/:id", async (req, res) => {
  try {
    const car = await CarModel.findById(req.params.id).populate("owner model");
    if (!car) return res.status(404).json({ error: "Car not found" });
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/cars/:id", async (req, res) => {
  try {
    const car = await CarModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/cars/:id", async (req, res) => {
  try {
    await CarModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Car deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
