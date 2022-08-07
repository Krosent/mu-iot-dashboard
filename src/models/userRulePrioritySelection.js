const mongoose = require('mongoose');

const { PrioritySelectionSchema } = require('./prioritySelection');

const UserPrioritySelectionSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  prioritySelectionList: {
    type: [PrioritySelectionSchema],
    required: true,
  },
});

const UserPrioritySelection = mongoose.model('UserPrioritySelection', UserPrioritySelectionSchema);

module.exports = { UserPrioritySelection };
