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

// entry point routes
const entryPointRouter = require('./routes/entry');

app.use('/', entryPointRouter);

// dashboard routes
const dashboardRouter = require('./routes/dashboard');

app.use('/dashboard', dashboardRouter);

// solid auth routes
const solidRouter = require('./routes/solid-hass');

app.use('/', solidRouter);

module.exports = app;
