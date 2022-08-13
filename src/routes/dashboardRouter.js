const express = require('express');

const router = express.Router();
const { getRulesByName } = require('../models/rule');
const { getSuppressedRulesByAffectedUser } = require('../models/suppressedRuleLog');

const {
  dashboardView, // fetchUserAutomationRules, fetchOtherUsersAutomationRules,
} = require('../controllers/dashboardController');

router.get('/', async (req, res) => {
  // TODO: Implement authorization check (low priority)

  // Fetch current user rules from state store
  const rules = await getRulesByName(req.session.user);

  const conflictingRules = await getSuppressedRulesByAffectedUser(req.session.user);

  console.log(`Dashboard Rules: ${rules}`);

  dashboardView(res, rules, conflictingRules);
});

module.exports = router;
