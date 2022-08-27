/*
Author: Artyom Kuznetsov
This project is a part of Thesis Work on topic:
- TOWARDS INTELLIGIBILITY IN MULTI-USER IOT ENVIRONMENTS

Promotor: prof. dr. Beat Signer
Supervisor: Ekene Attoh
*/

/* eslint-disable no-console */
const solidNodeClient = require('solid-node-client');
const SolidFileClient = require('solid-file-client');

// hardcoded values. Onboarding is not implemented for POC
const allUsers = ['krosent', 'AleksandraVub'];

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

async function downloadAllAutomationRules() {
// POC Level Implementation
// Fetch Other Users Rules from Solid PODs

  const allRules = allUsers.map(async (user) => {
    const userRules = await fetchAutomations(
      user,
      'iot-solid-bot',
      'kDLpdi!LK2AV84k',
    );

    return {
      username: user,
      rules: userRules,
    };
  });

  const result = await Promise.all(allRules);
  return result;
}

module.exports = {
  downloadAllAutomationRules,
};
