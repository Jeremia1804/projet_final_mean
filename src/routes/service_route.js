const express = require("express");
const router = express.Router();
const { ServiceModel, CategoryServiceModel } = require("../models/service");
const { verifyToken, checkRole } = require('../middlewares/authMiddleware')
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });
const path = require("path");

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

    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    fs.unlinkSync(filePath);

    const result = await CategoryServiceModel.importData(jsonData);

    res.status(200).json({ message: "File processed successfully", jsonData });
});


router.post('/services/import', upload.single('file'), (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(sheet);

  fs.unlinkSync(filePath);

  res.status(200).json({ message: 'File processed successfully', data: jsonData });
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
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(jsonData);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");

      const filePath = path.join(__dirname, "categories_export.xlsx");

      XLSX.writeFile(workbook, filePath);

      res.download(filePath, "categories_export.xlsx", (err) => {
          if (err) {
              console.error("Error sending file:", err);
              res.status(500).json({ error: "Failed to send file" });
          }

          fs.unlinkSync(filePath);
      });

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

module.exports = router;
