/* eslint-disable max-len */
const CronJob = require('node-cron');
const rulesDownloaderController = require('../controllers/rulesDownloaderController');
const { Rule } = require('../models/rule');

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

    // TODO: Identify which rules have conflicts and save them as conflicting rules
  });

  scheduledJobFunction.start();
};
