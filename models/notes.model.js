const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  route: {
    type: String,
    required: true,
  },
  notes: [{ type: Object, required: true }],
});

module.exports = mongoose.model("notes", notesSchema);
