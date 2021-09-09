const express = require('express');
const authController = require('../controllers/auth');
const chatController = require('../controllers/chat');
const tweetController = require('../controllers/tweet');

const router = express.Router();

// auth related routes
router.post('/register', authController.register);

router.post('/login', authController.login);

// private chat related routes
router.get('/chat/:receiver', [ authController.isLoggedIn, chatController.fetch ]);

router.post('/chat/:receiver', [ authController.isLoggedIn, chatController.send ]);

// tweet related routes
router.get('/tweet/:id', tweetController.getTweet);

router.post('/tweet', [ authController.isLoggedIn, tweetController.postTweet ]);

router.patch('/tweet/:id', [ authController.isLoggedIn, tweetController.updateTweet ]);

router.delete('/tweet/:id', [ authController.isLoggedIn, tweetController.deleteTweet ]);

module.exports = router;