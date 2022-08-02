/* eslint-disable no-console */
const solidNodeClient = require('solid-node-client');
const SolidFileClient = require('solid-file-client');
const express = require('express');

const app = express();
const fs = require('fs');
const path = require('path');

app.set('view engine', 'ejs');

app.use(
  '/css',
  express.static(path.join('./', 'node_modules/bootstrap/dist/css')),
);

app.use(
  '/js',
  express.static(path.join('./', 'node_modules/bootstrap/dist/js')),
);

app.use('/js', express.static(path.join('./', 'node_modules/jquery/dist')));

app.use('/popper', express.static(path.join('./', 'node_modules/@popperjs/core/dist')));

app.use('/vis-timeline', express.static(path.join('./', 'node_modules/vis-timeline')));

app.get('/', (req, res) => {
  res.render('pages/index');
});

let isCharging = false;

app.get('/battery/api', async (req, res) => {
  res.status(200).json({ charger_type: 'powerBank', icon: 'battery', is_charging: isCharging });
});

app.get('/battery/api/:charging', async (req, res) => {
  isCharging = req.params.charging;
  res.status(200).json({ charger_type: 'powerBank', icon: 'battery', is_charging: isCharging });
});

/* idp: 'https://broker.pod.inrupt.com', // e.g. https://solidcommunity.net
  username: 'iot-solid-bot',
  password: 'kDLpdi!LK2AV84k',
*/

/*
  Another SOLID account:
  krosent
  VtHf5NGuQffE2n7P
*/

app.get('/authorize/:username/:password', async (req, res) => {
  const client = new solidNodeClient.SolidNodeClient();
  const fileClient = new SolidFileClient(client);
  console.log(`username: ${req.params.username}`);
  console.log(`password: ${req.params.password}`);

  await client.login({
// const axios = require('axios');
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

        // TODO: Create person in configuration
        // const readPersonFile = fs.readFileSync('/home/krosent/Projects/hass/core/config/.storage/person.yaml');
        // const personJson = JSON.parse(readPersonFile);
        // if (personJson.data.items.contains())

        res.status(200).send('Authorized');
      } else {
        res.status(405).send('Unauthorized');
      }
    })
    .catch((error) => res.status(405).send('Unauthorized'));
});

app.get('/automations/fetch', async (_, res) => {
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

module.exports = app;
