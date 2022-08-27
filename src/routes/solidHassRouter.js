/*
Author: Artyom Kuznetsov
This project is a part of Thesis Work on topic:
- TOWARDS INTELLIGIBILITY IN MULTI-USER IOT ENVIRONMENTS

Promotor: prof. dr. Beat Signer
Supervisor: Ekene Attoh
*/

const express = require('express');
const fs = require('fs');
const solidNodeClient = require('solid-node-client');
const SolidFileClient = require('solid-file-client');

const router = express.Router();

// This router was used during the experementation of integration SOLID into HomeAssistant.
// We were able to integrate login authorisation via CLI method
// However keep in mind HASS does not support custom authorisation methods
// Therefore if you want to have HASS with Solid integrated you would need
// to create custom version of HASS and maintain it yourself
router.get('/authorize/:username/:password', async (req, res) => {
  const client = new solidNodeClient.SolidNodeClient();
  const fileClient = new SolidFileClient(client);
  console.log(`username: ${req.params.username}`);
  console.log(`password: ${req.params.password}`);

  await client.login({
    idp: 'https://solidcommunity.net', // e.g. https://solidcommunity.net
    username: req.params.username,
    password: req.params.password,
  });
  client
    .getSession()
    .then((session) => {
      console.log(session);
      if (session.isLoggedIn) {
        const fileLink = `https://${req.params.username}.solidcommunity.net/automations/automations.yaml`;
        try {
          fileClient.readFile(fileLink).then((fl) => {
            if (!fs.existsSync(`/home/krosent/Projects/hass/core/config/${req.params.username}.yaml`)) {
              fs.writeFile(`/home/krosent/Projects/hass/core/config/${req.params.username}.yaml`, fl, { flag: 'a+' }, (automationFileError) => {
                if (automationFileError) {
                  console.error(automationFileError);
                  return;
                }
                // file written successfully
                console.log(`automations.file for user ${req.params.username} was created`);
                const includeNewAutomationsFile = `automation ${req.params.username}: !include ${req.params.username}.yaml\r\n`;
                fs.writeFile('/home/krosent/Projects/hass/core/config/configuration.yaml', includeNewAutomationsFile, { flag: 'a+' }, (configFileError) => {
                  if (configFileError) {
                    console.error(configFileError);
                    return;
                  }
                  console.log(`automations.file for user ${req.params.username} was added to configuration.yaml`);
                });
              });
            }
          });
        } catch (err) {
          console.log(`error is: ${err}`);
        }
        res.status(200).send('Authorized');
      } else {
        res.status(405).send('Unauthorized');
      }
    })
    .catch((error) => res.status(405).send(`Unauthorized, error: ${error}`));
});

router.get('/automations/fetch', async (_, res) => {
  // https://iot-solid-bot.solidcommunity.net/automations/automations.yaml
  const client = new solidNodeClient.SolidNodeClient();
  const fileClient = new SolidFileClient(client);

  const fileLink = 'https://iot-solid-bot.solidcommunity.net/automations/automations.yaml';
  try {
    const file = await fileClient.readFile(fileLink);

    res.write(file, 'binary');
    res.end();
  } catch (err) {
    console.log(`error is: ${err}`);
  }
});

module.exports = router;
