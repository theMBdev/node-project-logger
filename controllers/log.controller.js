const Log = require('../models/log.model');
const User = require('../models/user.model');

var moment = require('moment');
moment().format();


exports.test = function (req, res) {
    res.send('Greetings from the Log test controller!');
};


exports.log_create_view = function (req, res) {    

    // check if user has logs if not show empty state
    Log.find({user: req.user._id}, (err, logs) => {

        res.render('create-log', {logs: logs, moment: moment});   

    })     

};

exports.log_create = function (req, res, next) {


    const { name } = req.body;
    let errors = [];

    if (!name) {
        errors.push({ msg: 'Please enter a log name' });

        if (errors.length > 0) {                

            Log.find({user: req.user._id}, (err, logs) => {

                res.render('create-log', {logs: logs, moment: moment, errors});   

            })

        }


    } else {


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
    }
};
