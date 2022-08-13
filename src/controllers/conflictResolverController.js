/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable no-console */
// const mongoose = require('mongoose');
const { getGroupedConflictingRules, setRuleHasConflict, unsetRuleHasConflict } = require('../models/rule');
const { getUserPrioritySelectionByName } = require('../models/userRulePrioritySelection');

async function suppressRuleWithLowerScore(ruleToSuppress, otherRules) {
  console.log(`Rule Suppressed: ${JSON.stringify(ruleToSuppress)}`);
  await setRuleHasConflict(ruleToSuppress.ruleId);
  otherRules.forEach(async (r) => unsetRuleHasConflict(r.ruleId));

  // TODO: Save Logs to Datastore regarding why certain rule was suppressed
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
        const rulePrioritiesForUser = await getUserPrioritySelectionByName(rule.username, rule.category);
        const rulePriorityScoreForUser = rulePrioritiesForUser.prioritySelectionList.filter((selection) => selection.name === rule.category)[0].score;
        return ({
          ruleId: rule.ruleId, username: rule.username, category: rule.category, device: rule.device, trigger: rule.trigger, action: rule.action, userScore: rulePriorityScoreForUser,
        });
      });

    const conflictingUsersResolved = await Promise.all(conflictingUsers);

    const maxScoreRule = conflictingUsersResolved.reduce((prev, current) => ((prev.userScore > current.userScore) ? prev : current));
    const minScoreRule = conflictingUsersResolved.reduce((prev, current) => ((prev.userScore < current.userScore) ? prev : current));

    if (minScoreRule === maxScoreRule) {
      throw new Error('Rules with the same score are not supported for the moment');
    }
    // Update Rule in the Data Store
    suppressRuleWithLowerScore(minScoreRule, [maxScoreRule]);
  });
  // Determine users
  // Determine rule priority
  // Compare user's preferences
  // Suppress rule with lower rule priority
}

module.exports = {
  executeConflictResolution,
};
