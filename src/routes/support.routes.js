const express = require('express');
const router = express.Router();
const supportController = require('../controllers/support.controller');

// Enviar mensaje de contacto
router.post('/contact', supportController.sendContactMessage);

// Reportar problema técnico
router.post('/report', supportController.reportProblem);

module.exports = router;
