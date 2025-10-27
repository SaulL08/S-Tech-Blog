
const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscriber.controller');
const { verifyToken } = require('../middlewares/auth');

router.post('/subscribe', subscriberController.subscribe);
router.post('/unsubscribe', subscriberController.unsubscribe);
router.get('/', verifyToken, subscriberController.getAllSubscribers);

module.exports = router;
