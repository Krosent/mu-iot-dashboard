const mongoose = require('mongoose');

const PrioritySelectionSchema = new mongoose.Schema({
  _id: Number,
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

function getPrioritySelectionByName(name) {
  return PrioritySelection.findOne({ name }).catch((err) => console.log(`could not find priority selection by name: ${err}`));
}

module.exports = { PrioritySelection, PrioritySelectionSchema, getPrioritySelectionByName };
