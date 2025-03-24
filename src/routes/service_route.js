const express = require("express");
const router = express.Router();
const { ServiceModel, CategoryServiceModel } = require("../models/service");
const { verifyToken, checkRole } = require('../middlewares/authMiddleware')

router.post("/services",verifyToken, checkRole("ADMIN"), async (req, res) => {
  try {
    const service = new ServiceModel(req.body);
    await service.save();
    res.status(201).json({ message: "Service created successfully", service });
  } catch (error) {
    res.status(500).json({ error: "Failed to create service", details: error.message });
  }
});

router.get("/services", async (req, res) => {
  try {
    const services = await ServiceModel.find().populate("category_id");
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch services", details: error.message });
  }
});

router.get("/services/:id", async (req, res) => {
  try {
    const service = await ServiceModel.findById(req.params.id).populate("category_id");
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch service", details: error.message });
  }
});

router.put("/services/:id", verifyToken, checkRole("ADMIN"), async (req, res) => {
  try {
    const service = await ServiceModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("category_id");
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json({ message: "Service updated successfully", service });
  } catch (error) {
    res.status(500).json({ error: "Failed to update service", details: error.message });
  }
});

router.delete("/services/:id", verifyToken, checkRole("ADMIN"), async (req, res) => {
  try {
    const service = await ServiceModel.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete service", details: error.message });
  }
});

router.post("/categories", verifyToken, checkRole("ADMIN"), async (req, res) => {
  try {
    const category = new CategoryServiceModel(req.body);
    await category.save();
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ error: "Failed to create category", details: error.message });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await CategoryServiceModel.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories", details: error.message });
  }
});

router.get("/categories/:id", async (req, res) => {
  try {
    const category = await CategoryServiceModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category", details: error.message });
  }
});

router.put("/categories/:id", verifyToken, checkRole("ADMIN"), async (req, res) => {
  try {
    const category = await CategoryServiceModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ error: "Failed to update category", details: error.message });
  }
});

router.delete("/categories/:id", verifyToken, checkRole("ADMIN"), async (req, res) => {
  try {
    const category = await CategoryServiceModel.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category", details: error.message });
  }
});

module.exports = router;
