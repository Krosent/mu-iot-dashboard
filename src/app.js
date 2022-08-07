/* eslint-disable no-console */
const express = require('express');

const app = express();
const path = require('path');
const mongoose = require('mongoose');

const conflictResolutionJob = require('./jobs/conflictResolutionJob');

app.set('view engine', 'ejs');

// import dependencies for frontend
app.use(
  '/css',
  express.static(path.join('./', 'node_modules/bootstrap/dist/css')),
);

app.use(
  '/css',
  express.static(path.join('./', 'node_modules/bootstrap-icons')),
);

app.use(
  '/js',
  express.static(path.join('./', 'node_modules/bootstrap/dist/js')),
);

app.use('/js', express.static(path.join('./', 'node_modules/jquery/dist')));

app.use('/popper', express.static(path.join('./', 'node_modules/@popperjs/core/dist')));

app.use('/vis-timeline', express.static(path.join('./', 'node_modules/vis-timeline')));

// database connection
mongoose.connect(
  'mongodb://localhost:27017/muiotapp?authSource=admin',
).then(() => console.log('Connected to MongoDB!')).catch((error) => console.log(`MongoDB Connection Failed, reason: ${error}`));

// event loop to analyse rules every 5 minutes
conflictResolutionJob.initConflictResolutionJob();

// entry point routes
const entryPointRouter = require('./routes/entryRouter');

app.use('/', entryPointRouter);

// dashboard routes
const dashboardRouter = require('./routes/dashboardRouter');

app.use('/dashboard', dashboardRouter);

// solid auth routes
const solidRouter = require('./routes/solidHassRouter');

app.use('/', solidRouter);

module.exports = app;
