const solidNodeClient = require('solid-node-client');
const SolidFileClient = require('solid-file-client');

const express = require('express');

// const axios = require('axios');

// import { getFile, isRawData, getContentType, getSourceUrl, } from "@inrupt/solid-client";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>A JavaScript project</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>A JavaScript project</h1>
</body>
</html>`;

const app = express();
const client = new solidNodeClient.SolidNodeClient();
const fileClient = new SolidFileClient(client);

app.get('/', async (_, res) => {
  res.set('Content-Type', 'text/html');
  await client.login({
    idp: 'https://solidcommunity.net', // e.g. https://solidcommunity.net
    username: 'iot-solid-bot',
    password: 'kDLpdi!LK2AV84k',
  });

  /* idp: 'https://broker.pod.inrupt.com', // e.g. https://solidcommunity.net
    username: 'iot-solid-bot',
    password: 'kDLpdi!LK2AV84k',
  */

  /* idp: 'https://broker.pod.inrupt.com', // e.g. https://solidcommunity.net
    username: 'krosent',
    password: 'ggUAL#H8dxcYw6q',
  */

  // console.log(`client: ${JSON.stringify(client)}`);

  client
    .getSession()
    .then((session) =>
      console.log(`Session: ${JSON.stringify(session.info.webId)}`))
    .catch((error) => console.log(`We have error: ${error}`));

  res.status(200).send(html);
});

app.get('/authorize/:username/:password', async (req, res) => {
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
        res.status(200).send('Authorized');
      } else {
        res.status(405).send('Unauthorized');
      }
    })
    .catch((error) => res.status(405).send('Unauthorized'));
});

app.get('/automations/fetch', async (_, res) => {
  // https://iot-solid-bot.solidcommunity.net/automations/automations.yaml

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
