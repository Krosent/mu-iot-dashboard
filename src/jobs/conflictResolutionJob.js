const CronJob = require('node-cron');

exports.initConflictResolutionJob = () => {
  const scheduledJobFunction = CronJob.schedule('*/10 * * * * *', () => {
    console.log("I'm executed on a schedule!");
    // TODO: Fetch users rules and save them locally

    // TODO: Identify which rules have conflicts and save them as conflicting rules
  });

  scheduledJobFunction.start();
};
