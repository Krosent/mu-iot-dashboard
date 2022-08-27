/*
Author: Artyom Kuznetsov
This project is a part of Thesis Work on topic:
- TOWARDS INTELLIGIBILITY IN MULTI-USER IOT ENVIRONMENTS

Promotor: prof. dr. Beat Signer
Supervisor: Ekene Attoh
*/

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
