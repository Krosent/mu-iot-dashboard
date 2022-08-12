/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable no-console */
// const mongoose = require('mongoose');
const { getGroupedConflictingRules } = require('../models/rule');
const { getUserPrioritySelectionByName } = require('../models/userRulePrioritySelection');

async function executeConflictResolution() {
  // POC Level Implementation

  // Fetch all rules
  // Find rules that work at the same time on the same device
  const groupedRules = await getGroupedConflictingRules();
  console.log(`grouped rules: ${JSON.stringify(groupedRules)}`);

  groupedRules.forEach(async (group) => {
    const conflictingUsers = await group.conflictRules
      .map((rule) => ({
        ruleId: rule._id, username: rule.username, category: rule.category,
      }))
      .map(async (rule) => {
        const rulePrioritiesForUser = await getUserPrioritySelectionByName(rule.username, rule.category);
        const rulePriorityScoreForUser = rulePrioritiesForUser.prioritySelectionList.filter((selection) => selection.name === rule.category)[0].score;
        return ({
          ruleId: rule._id, username: rule.username, category: rule.category, userScore: rulePriorityScoreForUser,
        });
      });

    const conflictingUsersResolved = await Promise.all(conflictingUsers);
    console.log(`Conflicting user: ${JSON.stringify(conflictingUsersResolved)}`);
  });
  // Determine users
  // Determine rule priority
  // Compare user's preferences
  // Suppress rule with lower rule priority
}

module.exports = {
  executeConflictResolution,
};
