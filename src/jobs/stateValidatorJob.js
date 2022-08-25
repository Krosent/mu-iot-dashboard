/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
const CronJob = require('node-cron');
const rulesDownloaderController = require('../controllers/rulesDownloaderController');
const { Rule } = require('../models/rule');
const { executeConflictResolution } = require('../controllers/conflictResolverController');
const { PrioritySelection } = require('../models/prioritySelection');

async function prepareRulePriorities() {
  // Prepare hardcoded user priorities for user krosent and Aleksandra
  // Hardcoded values for POC
  // const allUsers = ['krosent', 'AleksandraVub'];

  const rulePriorityCategories = [{
    _id: 0,
    name: 'meeting',
    score: 8,
  },
  {
    _id: 1,
    name: 'comfort',
    score: 5,
  },
  {
    _id: 2,
    name: 'personal',
    score: 4,
  },
  {
    _id: 3,
    name: 'health',
    score: 9,
  }];

  rulePriorityCategories.forEach(async (priorityCategory) => {
    const query = {
      _id: priorityCategory._id, name: priorityCategory.name, score: priorityCategory.score,
    };
    const update = {
      _id: priorityCategory._id, name: priorityCategory.name, score: priorityCategory.score,
    };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    await PrioritySelection.findOneAndUpdate(query, update, options).catch((err) => console.log(`error is here: ${err}`));
  });
}

function updateStateStore(rulesWithUsername) {
  rulesWithUsername.forEach(async (ruleWithUsername) => JSON.parse(ruleWithUsername.rules).forEach(async (rule) => {
    const query = {
      username: ruleWithUsername.username, description: rule.description, device: rule.device, trigger: rule.trigger, action: rule.action, category: rule.category,
    };
    const update = {
      username: ruleWithUsername.username, description: rule.description, device: rule.device, trigger: rule.trigger, action: rule.action, category: rule.category,
    };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    await Rule.findOneAndUpdate(query, update, options).catch((err) => console.log(`error is here: ${err}`));
  }));
}

exports.executeStateValidatorJob = () => {
  const scheduledJobFunction = CronJob.schedule('*/30 * * * * *', async () => {
    // Fetch users rules from SOLID and save them into state store
    const rulesWithUsername = await rulesDownloaderController.downloadAllAutomationRules();

    // Save (or update) fetched rules into state store
    updateStateStore(rulesWithUsername);

    console.log(`Downloaded rules are: ${JSON.stringify(rulesWithUsername)}`);

    prepareRulePriorities();

    executeConflictResolution();
  });

  scheduledJobFunction.start();
};
