const express = require('express');
const authController = require('../controllers/auth');
const chatController = require('../controllers/chat');

const router = express.Router();

// auth related routes
router.post('/register', authController.register);

router.post('/login', authController.login);

// chat related routes
router.get('/chat/:receiver', [ authController.isLoggedIn, chatController.fetch ]);

router.post('/chat/:receiver', [ authController.isLoggedIn, chatController.send ]);

module.exports = router;