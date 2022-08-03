const express = require('express');

const router = express.Router();

const session = require('express-session');

const solidNodeClient = require('solid-node-client');

const flash = require('connect-flash');

router.use(session({ secret: 'session secret key 007', cookie: { maxAge: 60000 } }));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(flash());

function sendLoginError(req, res, error) {
  console.log(`Login Error: ${error}`);
  req.flash('loginError', 'Incorrect  Credentials');
  res.redirect('/');
}

router.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.render('pages/entry', { loginError: req.flash('loginError') });
  }
});

router.post('/login', async (req, res) => {
  const client = new solidNodeClient.SolidNodeClient();

  await client.login({
    idp: 'https://solidcommunity.net',
    username: req.body.username,
    password: req.body.password,
  }).catch((error) => {
    sendLoginError(req, res, error);
  });

  client
    .getSession()
    .then((_session) => {
      console.log(_session);
      if (_session.isLoggedIn) {
        req.session.user = req.body.username;
        res.redirect('/');
      } else {
        sendLoginError(req, res, 'Session Login not Authorized');
      }
    })
    .catch((error) => res.status(405).send(`Unauthorized, error: ${error}`));
});

router.get('/logout', async (req, res) => {
  req.session.user = '';
  res.redirect('/');
});

module.exports = router;
