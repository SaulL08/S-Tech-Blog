
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth');

router.post('/login', authController.login);
router.post('/verify', verifyToken, authController.verify);
router.post('/generate-hash', authController.generateHash); // Solo para desarrollo

module.exports = router;
