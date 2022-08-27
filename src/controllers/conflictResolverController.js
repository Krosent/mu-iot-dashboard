/*
Author: Artyom Kuznetsov
This project is a part of Thesis Work on topic:
- TOWARDS INTELLIGIBILITY IN MULTI-USER IOT ENVIRONMENTS

Promotor: prof. dr. Beat Signer
Supervisor: Ekene Attoh
*/

/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable no-console */
// const mongoose = require('mongoose');
const { getGroupedConflictingRules, setRuleHasConflict, unsetRuleHasConflict } = require('../models/rule');
const { getPrioritySelectionByName } = require('../models/prioritySelection');
const { saveSuppressionLogs, removeSuppressionRecord } = require('../models/suppressedRuleLog');

async function suppressRulesWithLowerScore(ruleSuppressor, rulesToSuppress) {
  // Suppressor rule which state we set to false
  unsetRuleHasConflict(ruleSuppressor.ruleId);
  // Remove rule from suppression log (if has record)
  removeSuppressionRecord(ruleSuppressor.ruleId);

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
    // Suppress rule with lower rule priority
    suppressRulesWithLowerScore(maxScoreRule, rulesToSuppress);
  });
}

module.exports = {
  executeConflictResolution,
};
