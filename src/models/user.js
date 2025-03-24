const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  lastname: { type: String, required: true },
  name: { type: String, required: true },
  login: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  contact: { type: String, required: false },
  profil: { type: String, required: false },
});

class UserModel extends mongoose.model("users", userSchema) {}

module.exports = UserModel;
