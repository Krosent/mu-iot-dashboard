/*
Author: Artyom Kuznetsov
This project is a part of Thesis Work on topic:
- TOWARDS INTELLIGIBILITY IN MULTI-USER IOT ENVIRONMENTS

Promotor: prof. dr. Beat Signer
Supervisor: Ekene Attoh
*/

/* eslint-disable no-console */
const { getRulesByName, getRulesOfOtherUsers } = require('../models/rule');
const { getSuppressedRulesByAffectedUser } = require('../models/suppressedRuleLog');

function dashboardView(res, rules, conflictingRules, rulesOfOtherUsers, currentUser) {
  return res.render('pages/dashboard', {
    currentUserRules:
    rules,
    conflictingRules,
    rulesOfOtherUsers,
    currentUser,
  });
}

async function getDashboard(req, res) {
  // TODO: Implement authorization check (low priority)

  // Fetch current user rules from state store
  const rules = await getRulesByName(req.session.user);

  const rulesOfOtherUsers = await getRulesOfOtherUsers(req.session.user);

  const conflictingRules = await getSuppressedRulesByAffectedUser(req.session.user);

  console.log(`Dashboard Rules: ${rules}`);

  return dashboardView(res, rules, conflictingRules, rulesOfOtherUsers, req.session.user);
}

module.exports = {
  getDashboard,
};
