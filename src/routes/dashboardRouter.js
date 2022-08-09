const express = require('express');

const router = express.Router();
const { getRulesByName } = require('../models/rule');

const {
  dashboardView, // fetchUserAutomationRules, fetchOtherUsersAutomationRules,
} = require('../controllers/dashboardController');

router.get('/', async (req, res) => {
  // TODO: Implement authorization check (low priority)

  // TODO: Fetch current user rules
  const rules = await getRulesByName(req.session.user);

  console.log(`Dashboard Rules: ${rules}`);

  /*
  const thisUserRules = await fetchUserAutomationRules(req);
  console.log(`this user rules: ${thisUserRules}`);

  const otherUsersRules = await fetchOtherUsersAutomationRules(req);
  console.log(`other users' rules: ${JSON.stringify(otherUsersRules)}`);
  */

  // conflictResolution(currentUserRules, otherUsersRules, ruleCategories);
  // conflictResolution(null, null, null);

  dashboardView(res, rules);
});

module.exports = router;
