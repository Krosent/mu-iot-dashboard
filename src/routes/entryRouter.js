/*
Author: Artyom Kuznetsov
This project is a part of Thesis Work on topic:
- TOWARDS INTELLIGIBILITY IN MULTI-USER IOT ENVIRONMENTS

Promotor: prof. dr. Beat Signer
Supervisor: Ekene Attoh
*/

const express = require('express');

const router = express.Router();
const session = require('express-session');
const flash = require('connect-flash');

router.use(session({ secret: 'session secret key 007', cookie: { maxAge: 60000 } }));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(flash());

const { getEntryPage, login, logout } = require('../controllers/entryController');

router.get('/', (req, res) => getEntryPage(req, res));

router.post('/login', async (req, res) => login(req, res));

router.get('/logout', async (req, res) => logout(req, res));

module.exports = router;
