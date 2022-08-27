/*
Author: Artyom Kuznetsov
This project is a part of Thesis Work on topic:
- TOWARDS INTELLIGIBILITY IN MULTI-USER IOT ENVIRONMENTS

Promotor: prof. dr. Beat Signer
Supervisor: Ekene Attoh
*/

const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
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
  hasAdminSuppressed: {
    type: Boolean,
    required: false,
    default: false,
  },
  adminSuppressionReason: {
    type: String,
    required: false,
  },
});

const Rule = mongoose.model('Rule', RuleSchema);

function getRulesByName(user) {
  return Rule.find({ username: user });
}

function getRulesOfOtherUsers(user) {
  return Rule.find({ username: { $ne: user } });
}

function getAllRules() {
  const filter = {};
  return Rule.find(filter);
}

function getGroupedConflictingRules() {
  return Rule.aggregate(
    [
      {
        $group: {
          _id: {
            device: '$device',
            trigger: '$trigger',
          },
          numberOfSimilarRules: { $sum: 1 },
          conflictRules: { $push: '$$ROOT' },
        },
      },
    ],
  );
}

function setRuleHasConflict(id) {
  return Rule.findByIdAndUpdate({ _id: id }, { hasConflict: true });
}

function unsetRuleHasConflict(id) {
  return Rule.findByIdAndUpdate({ _id: id }, { $set: { hasConflict: false } }, () => {});
}

module.exports = {
  Rule,
  getRulesByName,
  getRulesOfOtherUsers,
  getAllRules,
  getGroupedConflictingRules,
  setRuleHasConflict,
  unsetRuleHasConflict,
};
