const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  device: {
    type: String,
    required: true,
  },
  trigger: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: false,
    default: true,
  },
  category: {
    type: String,
    required: false,
    default: true,
  },
  hasConflict: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const Rule = mongoose.model('Rule', RuleSchema);

module.exports = { Rule };
