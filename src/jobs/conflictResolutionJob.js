/* eslint-disable max-len */
const CronJob = require('node-cron');
const rulesDownloaderController = require('../controllers/rulesDownloaderController');
const { Rule } = require('../models/rule');
const { UserPrioritySelection } = require('../models/userRulePrioritySelection');
const { executeConflictResolution } = require('../controllers/conflictResolverController');

async function prepareUserPriorities() {
  // Prepare hardcoded user priorities for user krosent and Aleksandra
  // Hardcoded values for POC
  // const allUsers = ['krosent', 'AleksandraVub'];

  const krosent = {
    username: 'krosent',
    prioritySelectionList: [
      {
        _id: 0,
        name: 'meeting',
        score: 8,
      },
      {
        _id: 1,
        name: 'comfort',
        score: 5,
      },
    ],
  };

  const aleksandraVub = {
    username: 'AleksandraVub',
    prioritySelectionList: [
      {
        _id: 2,
        name: 'personal',
        score: 4,
      },
      {
        _id: 3,
        name: 'health',
        score: 9,
      },
    ],
  };

  const query1 = {
    username: krosent.username, prioritySelectionList: krosent.prioritySelectionList,
  };
  const update1 = {
    username: krosent.username, prioritySelectionList: krosent.prioritySelectionList,
  };
  const options1 = { upsert: true, new: true, setDefaultsOnInsert: true };
  await UserPrioritySelection.findOneAndUpdate(query1, update1, options1).catch((err) => console.log(`error is here: ${err}`));

  const query2 = {
    username: aleksandraVub.username, prioritySelectionList: aleksandraVub.prioritySelectionList,
  };
  const update2 = {
    prioritySelectionList: aleksandraVub.prioritySelectionList,
  };
  const options2 = { upsert: true, new: true, setDefaultsOnInsert: true };
  await UserPrioritySelection.findOneAndUpdate(query2, update2, options2).catch((err) => console.log(`error is here: ${err}`));
}

exports.initConflictResolutionJob = () => {
  const scheduledJobFunction = CronJob.schedule('*/30 * * * * *', async () => {
    // Fetch users rules and save them into state store
    const rulesWithUsername = await rulesDownloaderController.downloadAllAutomationRules();

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

    console.log(`Downloaded rules are: ${JSON.stringify(rulesWithUsername)}`);

    prepareUserPriorities();

    // TODO: Identify which rules have conflicts and save them as conflicting rules
    executeConflictResolution();
  });

  scheduledJobFunction.start();
};
