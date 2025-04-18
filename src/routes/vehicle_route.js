const express = require("express");
const { BrandModel, ModelModel, CarModel } = require("../models/vehicle.js");
const { verifyToken, checkRole } = require('../middlewares/authMiddleware')
const router = express.Router();
const { importXLSX, exportXLSX } = require('../utils/xlsx.service')
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post("/brands/import", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const buffer = req.file.buffer;
    const jsonData = importXLSX(buffer);
    const result = await BrandModel.importData(jsonData);

    res.status(200).json({ message: "Import successful", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/brands/export", async (req, res) => {
  try {
    const brands = await BrandModel.find();

    const exportData = brands.map(brand => ({
      id: brand._id.toString(),
      name: brand.name,
      country: brand.country || "",
      foundedYear: brand.foundedYear || "",
    }));

    const buffer = await exportXLSX(exportData, "brands_export");

    res.setHeader("Content-Disposition", "attachment; filename=brands_export.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/models/import", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const jsonData = importXLSX(req.file.buffer);
    const result = await ModelModel.importData(jsonData);

    res.status(200).json({ message: "Import successful", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/models/export", async (req, res) => {
  try {
    const models = await ModelModel.find().populate("brand");
    const exportData = models.map((model) => ({
      id: model._id.toString(),
      name: model.name,
      brand_name: model.brand?.name || "Unknown",
      fuelType: model.fuelType,
      horsepower: model.horsepower,
      year: model.year,
    }));

    const buffer = await exportXLSX(exportData, "Models");

    res.setHeader("Content-Disposition", "attachment; filename=models_export.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


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

router.post("/cars", verifyToken, checkRole("USER"), async (req, res) => {
  try {
    const car = new CarModel({
      ...req.body,
      owner: req.user.userId,
    });
    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/cars", verifyToken, checkRole(["ADMIN","MECA", "USER"]), async (req, res) => {
  try {
    let cars;

    if (["ADMIN", "MECA"].includes(req.user.role)) {
      cars = await CarModel.find().populate("owner model");
    } else {
      cars = await CarModel.find({ owner: req.user.userId }).populate({
        path: "model",
        populate: { path: "brand" }
      });;
    }
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/cars/:id",verifyToken, checkRole(["ADMIN","MECA", "USER"]), async (req, res) => {
  try {
    let car;
    if (["ADMIN", "MECA"].includes(req.user.role)) {
      car = await CarModel.findById(req.params.id).populate("owner model");
    } else {
      car = await CarModel.findOne({ _id: req.params.id, owner: req.user.userId }).populate("owner model");
    }
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
