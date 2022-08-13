/* eslint-disable no-console */

function dashboardView(res, rules, conflictingRules, currentUser) {
  res.render('pages/dashboard', { currentUserRules: rules, conflictingRules, currentUser });
}

module.exports = {
  dashboardView,
};
