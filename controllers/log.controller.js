const Log = require('../models/log.model');
const User = require('../models/user.model');
const Entry = require('../models/entry.model');

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


    function doNameCheck(callback) {

        if(name) {
            // if name is already being used
            // search logs of user
            // maybe need an and here
            Log.find({user: req.user._id, name: { $exists: true, $in: [ req.body.name ] }}, (err, logs) => {

                if(logs.length > 0) {
                    console.log("duplicate") 
                    errors.push({ msg: 'Please enter a log name that is not being used' });
                    callback();
                } else {
                    callback();
                }
            })

        } else if (!name) {
            errors.push({ msg: 'Please enter a log name' }); 
            callback();
        } 
    }

    doNameCheck( function() {

        if (errors.length > 0) {                

            Log.find({user: req.user._id}, (err, logs) => {

                res.render('create-log', {logs: logs, moment: moment, errors});
            })

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
    });

};

//alert('Finished my homework');









exports.log_create_view = function (req, res) {    

    // check if user has logs if not show empty state
    Log.find({user: req.user._id}, (err, logs) => {

        res.render('create-log', {logs: logs, moment: moment});   

    })     

};



exports.log_delete_view = function (req, res) {    

    // check if user has logs if not show empty state
    Log.find({user: req.user._id}, (err, logs) => {

        //        console.log("Logs Of User", logs)

        res.render('delete-log', {logs: logs, moment: moment});   

    })     

};


exports.log_delete = function (req, res) {

    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {

        Log.findById(req.params.id, function (err, logs) {
            if (err) return next(err);

            // remove all entries withing the log being removed
            logs.entries.forEach(element => { 
                console.log("elm", element)


                Entry.findByIdAndRemove(element, function (err) {
                    if (err) return next(err);  
                    console.log("Removed", element)
                    //                    req.flash('delete', 'Log Deleted')
                    //                    res.redirect('/entry/find');
                });

            });

            //  remove log id from user ref            
            User.findOneAndUpdate({_id: req.user.id}, {new: true}, function (err, user) {
                if (err) return next(err);

                // remove log id from user logs ref array
                user.logs.pull(req.params.id);
                user.save();


                // remove log
                Log.findByIdAndRemove(req.params.id, function (err) {
                    if (err) return next(err);  

                    req.flash('delete', 'Log Deleted')
                    res.redirect('/entry/find');
                });
            });
        });
    } else {
        //        res.send("Thats a bad id(ea)")
        res.render('500');   

    } 
}
