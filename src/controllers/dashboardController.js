/* eslint-disable no-console */

function dashboardView(res, rules) {
  res.render('pages/dashboard', { currentUserRules: rules });
}

module.exports = {
  dashboardView,
};
