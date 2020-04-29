const express = require('express');
const router = express.Router();

const entry_controller = require('../controllers/entry.controller');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


router.get('/test', entry_controller.test);
router.get('/test1', entry_controller.entry_test);

router.get('/display', entry_controller.display);

router.get('/create', ensureAuthenticated, entry_controller.entry_create_view);
router.post('/create', ensureAuthenticated, entry_controller.entry_create);


router.get("/find", ensureAuthenticated, entry_controller.entry_find);

//router.get('/:id', entry_controller.entry_details);

router.post('/:id/update', entry_controller.entry_update);
router.get('/:id/update', entry_controller.entry_update_view);

router.post('/:id/delete', entry_controller.entry_delete);

//router.get('/display', entry_controller.entry_display);




module.exports = router;

