const Log = require('../models/log.model');

var moment = require('moment');
moment().format();


exports.test = function (req, res) {
    res.send('Greetings from the Log test controller!');
};


exports.log_create = function (req, res, next) {
    let log = new Log(
        {
            name: req.body.name
        }
    );

    log.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Entry Created successfully')
    })
};
