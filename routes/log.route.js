const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


const log_controller = require('../controllers/log.controller');

router.get('/test', log_controller.test);


router.get('/create', ensureAuthenticated, log_controller.log_create_view);
router.post('/create', ensureAuthenticated, log_controller.log_create);




module.exports = router;