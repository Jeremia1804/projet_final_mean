const mongoose = require("mongoose");

const RdvSchema = new mongoose.Schema({
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "users", 
    required: true 
  },
  car: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Car", 
    required: true 
  },
  services: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Service", 
    required: true 
  }],
  datetime: { 
    type: Date, 
    required: true 
  },
  state: { 
    type: String, 
    enum: ["draft", "confirmed", "progress", "done", "canceled"], 
    default: "draft" 
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  assignedMechanic: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "users" 
  },
},  {  timestamps: true,
      toJSON: { virtuals: true }, 
      toObject: { virtuals: true }  
    }
);

RdvSchema.virtual("date").get(function () {
  return this.datetime.toISOString().split("T")[0]; // YYYY-MM-DD
});

RdvSchema.virtual("time").get(function () {
  return this.datetime.toISOString().split("T")[1].split(".")[0];
});

class RdvModel extends mongoose.model("Rdv", RdvSchema){}

module.exports = { RdvModel };
