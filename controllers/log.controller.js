const Log = require('../models/log.model');
const User = require('../models/user.model');

var moment = require('moment');
moment().format();


exports.test = function (req, res) {
    res.send('Greetings from the Log test controller!');
};


exports.log_create_view = function (req, res) {

    res.render('create-log');   

};

exports.log_create = function (req, res, next) {
    let log = new Log(
        {
            name: req.body.name,
            user: req.user.id
        }
    );

    log.save(function (err, log) {
        if (err) {
            return next(err);
        }

        // CODE FOR WHEN A LOG IS CREATED ADD TO USERS LOGS 
        req.user.logs.push(log);
        req.user.save();





        res.redirect('../entry/create');
    })
};
