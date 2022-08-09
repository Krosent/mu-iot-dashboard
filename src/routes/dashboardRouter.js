const express = require('express');

const router = express.Router();
const { getRulesByName } = require('../models/rule');

const {
  dashboardView, // fetchUserAutomationRules, fetchOtherUsersAutomationRules,
} = require('../controllers/dashboardController');

router.get('/', async (req, res) => {
  // TODO: Implement authorization check (low priority)

  // Fetch current user rules from state store
  const rules = await getRulesByName(req.session.user);

  console.log(`Dashboard Rules: ${rules}`);

  dashboardView(res, rules);
});

module.exports = router;
