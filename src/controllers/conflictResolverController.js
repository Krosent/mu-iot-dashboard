/* eslint-disable no-console */
// const mongoose = require('mongoose');
const { getGroupedConflictingRules } = require('../models/rule');

async function executeConflictResolution() {
  // POC Level Implementation

  // Fetch all rules
  // const allRules = await getAllRules();
  // console.log(`rules: ${allRules.array.groupBy((rule) => rule.device)}`);
  const groupedRules = await getGroupedConflictingRules();
  console.log(`grouped rules: ${JSON.stringify(groupedRules)}`);
  // Find rules that work at the same time on the same device
  // Determine users
  // Determine rule priority
  // Compare user's preferences
  // Suppress rule with lower rule priority
}

module.exports = {
  executeConflictResolution,
};
