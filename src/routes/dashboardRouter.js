const express = require('express');

const router = express.Router();

const { dashboardView, fetchUserAutomationRules, fetchOtherUsersAutomationRules } = require('../controllers/dashboardController');

router.get('/', (req, res) => {
  // TODO: Fetch User Rules
  fetchUserAutomationRules('todo');

  // TODO: Fetch Other User's Rules
  fetchOtherUsersAutomationRules();

  dashboardView(res);
});

module.exports = router;
