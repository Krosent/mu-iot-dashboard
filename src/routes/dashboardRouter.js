/*
Author: Artyom Kuznetsov
This project is a part of Thesis Work on topic:
- TOWARDS INTELLIGIBILITY IN MULTI-USER IOT ENVIRONMENTS

Promotor: prof. dr. Beat Signer
Supervisor: Ekene Attoh
*/

const express = require('express');

const router = express.Router();

const { getDashboard } = require('../controllers/dashboardController');

router.get('/', async (req, res) => getDashboard(req, res));

module.exports = router;
