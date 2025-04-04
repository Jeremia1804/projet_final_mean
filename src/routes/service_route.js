const express = require("express");
const router = express.Router();
const { ServiceModel, CategoryServiceModel } = require("../models/service");
const { verifyToken, checkRole } = require('../middlewares/authMiddleware')
const { importXLSX, exportXLSX } = require('../utils/xlsx.service')
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');
const upload = multer({ storage: multer.memoryStorage() });
const path = require("path");
const { importExcelWithImages, exportExcelWithImages } = require('../utils/exceljs.service');
const PriceServiceModel = require("../models/price_service");

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
    const { category_id, text_search } = req.query;
    let query = {};
    if (category_id) {
      query.category_id = category_id;
    }
    if (text_search) {
      query.name = { $regex: text_search, $options: "i" };
    }

    const services = await ServiceModel.find(query).populate("category_id prices");
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch services", details: error.message });
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
    const categories = await CategoryServiceModel.find().populate({
      path: "services",
      populate: { path: "prices" }
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories", details: error.message });
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


router.post('/categories/import', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const buffer = req.file.buffer;

    const jsonData = await importExcelWithImages(buffer, {id: 1, name: 2, description: 3});

    const result = await CategoryServiceModel.importData(jsonData);

    res.status(200).json({ message: "File processed successfully", result });
});

router.get("/categories/export", async (req, res) => {
  try {
    const categories = await CategoryServiceModel.find();

    if (categories.length === 0) {
      return res.status(404).json({ error: "No categories found" });
    }

    const jsonData = categories.map(cat => ({
      id: cat._id.toString(),
      name: cat.name,
      description: cat.description || "",
      img: cat.img || "",
    }));

    const columnMapping = { id: "id", name: "name", description: "description", img: "img" };

    const buffer = await exportExcelWithImages(jsonData, columnMapping);

    res.setHeader('Content-Disposition', 'attachment; filename=categories_export_jeremia.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);

  } catch (error) {
    res.status(500).json({ error: error.message });
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


router.post('/services/import', upload.single('file'), async (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
  }

  const buffer = req.file.buffer;

  try {
      const jsonData = await importExcelWithImages(buffer, {
          id: 1,
          name: 2,
          category_name: 3,
          standard_price: 4,
          duration: 5,
          description: 6,
          img: 7,
      });

      const result = await ServiceModel.importData(jsonData);

      res.status(200).json({ message: "File processed successfully", result });
  } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({ error: "Failed to process file" });
  }
});


router.get("/services/export", async (req, res) => {
  try {
      const services = await ServiceModel.find().populate("category_id");

      if (services.length === 0) {
          return res.status(404).json({ error: "No services found" });
      }

      const jsonData = services.map(service => ({
          id: service._id.toString(),
          name: service.name,
          category_name: service.category_id ? service.category_id.name : "",
          standard_price: service.standard_price,
          duration: service.duration || "",
          description: service.description || "",
          img: service.img || "",
      }));

      
      const columnMapping = { id: "id", name: "name",
                              category_name: "category_name", 
                              standard_price: "standard_price", 
                              duration: "duration",
                              description: "description",
                              img: "img",
                            };

      const buffer = await exportExcelWithImages(jsonData, columnMapping);

      res.setHeader('Content-Disposition', 'attachment; filename=services_export_jeremia.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
  } catch (error) {
      console.error("Export error:", error);
      res.status(500).json({ error: error.message });
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

router.post("/price-service/import", upload.single("file"), async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
      }

      const buffer = req.file.buffer;
      const jsonData = importXLSX(buffer);
      const result = await PriceServiceModel.importData(jsonData);

      res.status(200).json({ message: "Import successful", result });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});


router.get("/price-service/export", async (req, res) => {
  try {
      const prices = await PriceServiceModel.getAllPrices();

      const exportData = prices.map(price => ({
          service_name: price.service?.name || "Unknown",
          model_name: price.model?.name || "Unknown",
          price: price.price,
      }));

      const buffer = await exportXLSX(exportData, "Prices services")

      res.setHeader('Content-Disposition', 'attachment; filename=prices_service_export.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);

  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

module.exports = router;
