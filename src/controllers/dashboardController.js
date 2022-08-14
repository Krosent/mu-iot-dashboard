/* eslint-disable no-console */

function dashboardView(res, rules, conflictingRules, rulesOfOtherUsers, currentUser) {
  res.render('pages/dashboard', {
    currentUserRules:
    rules,
    conflictingRules,
    rulesOfOtherUsers,
    currentUser,
  });
}

module.exports = {
  dashboardView,
};
