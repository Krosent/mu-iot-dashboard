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
  suppressorRuleId: {
    type: String,
    required: true,
  },
  suppressorRuleScore: {
    type: Number,
    required: true,
  },
});

const SuppressedRuleLog = mongoose.model('SuppressedRuleLog', SuppressedRuleLogSchema);

function getSuppressedRulesByAffectedUser(username) {
  return SuppressedRuleLog.find({ affectedUser: username });
}

function saveSuppressionLogs(suppressedRule, suppressorRule) {
  const query = {
    affectedRuleId: suppressedRule.ruleId,
    affectedUser: suppressedRule.username,
    affectedRuleCategory: suppressedRule.category,
    affectedTrigger: suppressedRule.trigger,
    affectedAction: suppressedRule.action,
    affectedDevice: suppressedRule.device,
    affectedRuleScore: suppressedRule.userScore,
    suppressorUsername: suppressorRule.username,
    suppressorRuleCategory: suppressorRule.category,
    suppressorRuleId: suppressorRule.ruleId,
    suppressorRuleScore: suppressorRule.userScore,
  };
  const update = {
    affectedRuleId: suppressedRule.ruleId,
    affectedUser: suppressedRule.username,
    affectedRuleCategory: suppressedRule.category,
    affectedTrigger: suppressedRule.trigger,
    affectedAction: suppressedRule.action,
    affectedDevice: suppressedRule.device,
    affectedRuleScore: suppressedRule.userScore,
    suppressorUsername: suppressorRule.username,
    suppressorRuleCategory: suppressorRule.category,
    suppressorRuleId: suppressorRule.ruleId,
    suppressorRuleScore: suppressorRule.userScore,
  };
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  return SuppressedRuleLog.findOneAndUpdate(query, update, options).catch((err) => console.log(`error is here: ${err}`));
}

function removeSuppressionRecord(affectedRuleId) {
  SuppressedRuleLog.findOneAndDelete({ affectedRuleId }, (err) => {
    if (err) {
      console.log(`Cannot remove record from log: ${affectedRuleId}`);
    }
  });
}

module.exports = {
  SuppressedRuleLog,
  getSuppressedRulesByAffectedUser,
  saveSuppressionLogs,
  removeSuppressionRecord,
};
