/* eslint-disable no-console */

function dashboardView(res, rules, conflictingRules) {
  res.render('pages/dashboard', { currentUserRules: rules, conflictingRules });
}

module.exports = {
  dashboardView,
};
