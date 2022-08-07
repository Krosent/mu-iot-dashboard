const mongoose = require('mongoose');

const PrioritySelectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

const PrioritySelection = mongoose.model('PrioritySelection', PrioritySelectionSchema);

module.exports = { PrioritySelection, PrioritySelectionSchema };
