/* eslint-disable no-console */

// TODO: To remove this dependencies
// const solidNodeClient = require('solid-node-client');
// const SolidFileClient = require('solid-file-client');

function dashboardView(res, rules) {
  res.render('pages/dashboard', { currentUserRules: rules });
}

// TODO: To be removed
/*
async function fetchAutomations(username, hostUsername, hostPassword) {
  const client = new solidNodeClient.SolidNodeClient();
  const fileClient = new SolidFileClient(client);
  await client
    .login({
      idp: 'https://solidcommunity.net',
      username: hostUsername,
      password: hostPassword,
    })
    .catch((error) => {
      console.error(`Host Credentials Incorrect:${error}`);
    });

  const clientSession = await client.getSession();

  if (clientSession.isLoggedIn) {
    console.log('Host Session Authorised, System is able to proceed');
    const fileLink = `https://${username}.solidcommunity.net/automations/automations.json`;

    const content = await fileClient.readFile(fileLink);
    return content;
  }
  throw new Error('Failed to load file');
}

async function fetchUserAutomationRules(req) {
  return fetchAutomations(
    req.session.user,
    req.session.user,
    req.session.password,
  );
}

async function fetchOtherUsersAutomationRules(req) {
  // POC Level Implementation
  // Fetch Other Users Rules from Solid PODs
  const users = [];

  console.log(`session user: ${req.session.user}`);

  if (req.session.user !== 'AleksandraVub') {
    // TODO: Secure Implementation needed
    const aleksandraRules = await fetchAutomations(
      'AleksandraVub',
      'iot-solid-bot',
      'kDLpdi!LK2AV84k',
    );

    console.log(`rules: ${aleksandraRules}`);
    users.push({
      username: 'AleksandraVub',
      rules: aleksandraRules,
    });
  }

  if (req.session.user !== 'krosent') {
    // TODO: Secure Implementation needed
    const krosentRules = await fetchAutomations(
      'krosent',
      'iot-solid-bot',
      'kDLpdi!LK2AV84k',
    );

    users.push({
      username: 'krosent',
      rules: krosentRules,
    });
  }

  return users;
}
*/

module.exports = {
  dashboardView,
  // fetchUserAutomationRules,
  // fetchOtherUsersAutomationRules,
};
