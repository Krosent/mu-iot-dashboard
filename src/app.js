/* eslint-disable no-console */
const express = require('express');

const app = express();
const path = require('path');

app.set('view engine', 'ejs');

// import dependencies for frontend
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

// dashboard main page
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

// solid auth routes
const solidHass = require('./routes/solid-hass');
// …
app.use('/', solidHass);

module.exports = app;
