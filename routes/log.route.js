const express = require('express');
const router = express.Router();

const log_controller = require('../controllers/log.controller');

router.get('/test', log_controller.test);


router.get('/create', log_controller.log_create_view);
router.post('/create', log_controller.log_create);




module.exports = router;