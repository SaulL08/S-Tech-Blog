
const express = require('express');
const router = express.Router();
const postRoutes = require('./post.routes');
const authRoutes = require('./auth.routes');
const uploadRoutes = require('./upload.routes');
const subscriberRoutes = require('./subscriber.routes');
const supportRoutes = require('./support.routes');

router.use('/posts', postRoutes);
router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/subscribers', subscriberRoutes);
router.use('/support', supportRoutes);

module.exports = router;