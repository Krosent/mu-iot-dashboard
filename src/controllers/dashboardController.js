function dashboardView(res) {
  res.render('pages/dashboard');
}

function fetchUserAutomationRules(username) {
  // TODO: Implement
  return username;
}

function fetchOtherUsersAutomationRules() {
  // TODO: Implement
  return 0;
}

module.exports = {
  dashboardView,
  fetchUserAutomationRules,
  fetchOtherUsersAutomationRules,
};
