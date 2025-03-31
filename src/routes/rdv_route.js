const express = require("express");
const { RdvModel } = require("../models/rdv.js");
const { verifyToken, checkRole } = require('../middlewares/authMiddleware')
const router = express.Router();

router.post("/rdvs", verifyToken, checkRole("USER"), async (req, res) => {
    try {
        const { car, services, date, time } = req.body;

        const datetime = new Date(`${date}T${time}`);

        if (isNaN(datetime.getTime())) {
            return res.status(400).json({ error: "Invalid date or time format" });
        }

        const rdv = new RdvModel({
            car,
            services,
            datetime,
            customer: req.user.userId,
        });

        await rdv.save();
        res.status(201).json(rdv);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/rdvs", verifyToken, checkRole("ADMIN"), async (req, res) => {
    try {
        const rdvs = await RdvModel.find().populate("car services customer");
        res.status(200).json(rdvs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.patch("/rdvs/:id/cancel", verifyToken, checkRole(["USER", "ADMIN"]), async (req, res) => {
  try {
      const rdv = await RdvModel.findById(req.params.id);
      
      if (!rdv) {
          return res.status(404).json({ error: "Rendez-vous non trouvé" });
      }
      
      if (req.user.role === "USER" && rdv.customer.toString() !== req.user.userId) {
          return res.status(403).json({ error: "Vous ne pouvez annuler que vos propres rendez-vous" });
      }
      
      if (!["draft", "confirmed"].includes(rdv.state)) {
          return res.status(400).json({ error: "Vous ne pouvez annuler qu'un rendez-vous en état brouillon ou confirmé" });
      }
      
      rdv.state = "canceled";
      await rdv.save();
      
      res.status(200).json({ message: "Rendez-vous annulé avec succès", rdv });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


router.get("/rdvs/me", verifyToken, checkRole("USER"), async (req, res) => {
    try {
        const rdvs = await RdvModel.find({ customer: req.user.userId }).populate("car services");
        res.status(200).json(rdvs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router