const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const entry_controller = require('../controllers/entry.controller');


// a simple test url to check that all of our files are communicating correctly.
router.get('/test', entry_controller.test);

router.get('/display', entry_controller.display);

router.post('/create', entry_controller.entry_create);

router.get('/:id', entry_controller.entry_details);

router.put('/:id/update', entry_controller.entry_update);

router.delete('/:id/delete', entry_controller.entry_delete);

//router.get('/display', entry_controller.entry_display);




module.exports = router;