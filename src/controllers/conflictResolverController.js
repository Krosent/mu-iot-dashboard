/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable no-console */
// const mongoose = require('mongoose');
const { getGroupedConflictingRules, setRuleHasConflict, unsetRuleHasConflict } = require('../models/rule');
const { getPrioritySelectionByName } = require('../models/prioritySelection');
const { saveSuppressionLogs } = require('../models/suppressedRuleLog');

async function suppressRulesWithLowerScore(ruleSuppressor, rulesToSuppress) {
  // For POC we consider only rule suppression mechanism handling between two rules only

  // Suppressor rule which state we set to false
  unsetRuleHasConflict(ruleSuppressor.ruleId);

  // Other rules must be suppressed
  rulesToSuppress.forEach(async (r) => {
    console.log(`Rule Suppressed: ${JSON.stringify(r)}`);
    // Save Logs to Datastore regarding why certain rule was suppressed
    await saveSuppressionLogs(r, ruleSuppressor);
    return setRuleHasConflict(r.ruleId);
  });
}

async function executeConflictResolution() {
  // POC Level Implementation

  // Fetch all rules
  // Find rules that work at the same time on the same device
  const groupedRules = await getGroupedConflictingRules();
  console.log(`grouped rules: ${JSON.stringify(groupedRules)}`);

  groupedRules.forEach(async (group) => {
    const conflictingUsers = await group.conflictRules
      .map((rule) => ({
        ruleId: rule._id, username: rule.username, category: rule.category, device: rule.device, trigger: rule.trigger, action: rule.action,
      }))
      .map(async (rule) => {
        // const rulePrioritiesForUser = await getUserPrioritySelectionByName(rule.username, rule.category);
        const rulePrioritiesForUser = await getPrioritySelectionByName(rule.category);
        return ({
          ruleId: rule.ruleId, username: rule.username, category: rule.category, device: rule.device, trigger: rule.trigger, action: rule.action, userScore: rulePrioritiesForUser.score,
        });
      });

    const conflictingUsersPromiseResolved = await Promise.all(conflictingUsers);
    console.log(`Conflicting rules: ${JSON.stringify(conflictingUsersPromiseResolved)}`);

    const maxScoreRule = conflictingUsersPromiseResolved.reduce((prev, current) => ((prev.userScore > current.userScore) ? prev : current));
    const minScoreRule = conflictingUsersPromiseResolved.reduce((prev, current) => ((prev.userScore < current.userScore) ? prev : current));
    const rulesToSuppress = conflictingUsersPromiseResolved.filter((rule) => rule !== maxScoreRule);

    if (minScoreRule === maxScoreRule) {
      throw new Error('Rules with the same score are not supported for the moment');
    }
    // Update Rule in the Data Store
    // (ruleSuppressor, rulesToSuppress)
    suppressRulesWithLowerScore(maxScoreRule, rulesToSuppress);
  });
  // Determine users
  // Determine rule priority
  // Compare user's preferences
  // Suppress rule with lower rule priority
}

module.exports = {
  executeConflictResolution,
};
