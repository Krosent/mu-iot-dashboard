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

function getUserPrioritySelectionByName(username, priorityName) {
  return UserPrioritySelection.findOne({ username, 'prioritySelectionList.name': { $eq: priorityName } }).select('prioritySelectionList.name prioritySelectionList.score -_id');
}

module.exports = { UserPrioritySelection, getUserPrioritySelectionByName };
