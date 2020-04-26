const express = require('express');
const router = express.Router();

const test_controller = require('../controllers/test.controller');

router.post('/create', test_controller.test_create);


//router.get('/display', entry_controller.entry_display);

module.exports = router;