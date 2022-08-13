const mongoose = require('mongoose');

const SuppressedRuleLogSchema = new mongoose.Schema({
  affectedRuleId: {
    type: String,
    required: true,
  },
  affectedUser: {
    type: String,
    required: true,
  },
  affectedRuleCategory: {
    type: String,
    required: true,
  },
  affectedTrigger: {
    type: String,
    required: true,
  },
  affectedAction: {
    type: String,
    required: true,
  },
  affectedDevice: {
    type: String,
    required: true,
  },
  affectedRuleScore: {
    type: Number,
    required: true,
  },
  suppressorUsername: {
    type: String,
    required: true,
  },
  suppressorRuleCategory: {
    type: String,
    required: true,
  },
  suppressorRuleScore: {
    type: Number,
    required: true,
  },
});

const SuppressedRuleLog = mongoose.model('Rule', SuppressedRuleLogSchema);

function getSuppressedRulesByAffectedUser(username) {
  return SuppressedRuleLog.find({ affectedUser: username });
}

module.exports = {
  SuppressedRuleLog,
  getSuppressedRulesByAffectedUser,
};
