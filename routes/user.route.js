const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user.controller');

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
//router.get('/welcome', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, user_controller.user_dashboard);

// page open to all
//router.get('/openpage', (req, res) => res.render('openpage'));

router.get('/login', forwardAuthenticated, user_controller.user_login_view);
router.get('/register', forwardAuthenticated, user_controller.user_register_view);
router.post('/register', user_controller.user_register);
router.post('/login', user_controller.user_login);
router.get('/logout', user_controller.user_logout);

module.exports = router;
