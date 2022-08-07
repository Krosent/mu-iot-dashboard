/* eslint-disable max-len */
const officeCategories = {};

function populateKrosentCategories() {
  // TODO: Implement
  return null;
}

function populateAleksandraCategories() {
  // TODO: Implement
  return null;
}

// Hardcoded categories per user, for POC purposes
function populateRuleCategoriesPerUser() {
  // TODO: Implement, can use snippet below as inspiration

  populateKrosentCategories();

  populateAleksandraCategories();

  /*
  const query = {
    username: ruleWithUsername.username, description: rule.description, device: rule.device, trigger: rule.trigger, category: rule.category,
  };
  const update = {
    username: ruleWithUsername.username, description: rule.description, device: rule.device, trigger: rule.trigger, category: rule.category,
  };
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  await Rule.findOneAndUpdate(query, update, options).catch((err) => console.log(`error is here: ${err}`));
  */
}

module.exports = {
  officeCategories,
  populateRuleCategoriesPerUser,
};
