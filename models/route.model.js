const mongoose = require("mongoose");

const routesSchema = new mongoose.Schema({
  route: {
    type: String,
    required: true,
    unique: true,

  },
  editPassword: { type: String, required: true },
  viewPassword: { type: String, required: true },
});

module.exports = mongoose.model("routes", routesSchema);
