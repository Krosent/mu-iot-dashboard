/*
Author: Artyom Kuznetsov
This project is a part of Thesis Work on topic:
- TOWARDS INTELLIGIBILITY IN MULTI-USER IOT ENVIRONMENTS

Promotor: prof. dr. Beat Signer
Supervisor: Ekene Attoh
*/

/* eslint-disable max-len */

const solidNodeClient = require('solid-node-client');

function getEntryPage(req, res) {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.render('pages/entry', { loginError: req.flash('loginError') });
  }
}

function sendLoginError(req, res, error) {
  console.log(`Login Error: ${error}`);
  req.flash('loginError', 'Incorrect  Credentials');
  res.redirect('/');
}

async function login(req, res) {
  const client = new solidNodeClient.SolidNodeClient();

  await client.login({
    idp: 'https://solidcommunity.net',
    username: req.body.username,
    password: req.body.password,
  }).catch((error) => {
    sendLoginError(req, res, error);
  });

  return client
    .getSession()
    .then((_session) => {
      console.log(_session);
      if (_session.isLoggedIn) {
        req.session.user = req.body.username;
        req.session.password = req.body.password; // not safe way to store user credentials in session, only for POC
        res.redirect('/');
      } else {
        sendLoginError(req, res, 'Session Login not Authorized');
      }
    })
    .catch((error) => res.status(405).send(`Unauthorized, error: ${error}`));
}

function logout(req, res) {
  req.session.user = '';
  return res.redirect('/');
}

module.exports = {
  getEntryPage,
  login,
  logout,
};
