const express = require('express');

const router = express.Router();

const {
  dashboardView, fetchUserAutomationRules, fetchOtherUsersAutomationRules,
} = require('../controllers/dashboardController');

router.get('/', async (req, res) => {
  // TODO: Implement authorization check (low priority)

  const thisUserRules = await fetchUserAutomationRules(req);
  console.log(`this user rules: ${thisUserRules}`);

  const otherUsersRules = await fetchOtherUsersAutomationRules(req);
  console.log(`other users' rules: ${JSON.stringify(otherUsersRules)}`);

  // conflictResolution(currentUserRules, otherUsersRules, ruleCategories);
  // conflictResolution(null, null, null);

  dashboardView(res);
});

module.exports = router;
