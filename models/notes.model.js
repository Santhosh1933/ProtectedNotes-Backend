const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  routeId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  notes: [{ types: Object, required: true }],
});

module.exports = mongoose.model("notes", notesSchema);
