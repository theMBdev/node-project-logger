const Entry = require('../models/entry.model');

var moment = require('moment');
moment().format();



exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};


exports.display = function (req, res) {
    Entry.find({}, function(err, entry) {
        console.log(entry);
        
        res.render('new-page', {entry: entry, moment: moment});
    })
};


exports.entry_create = function (req, res) {
    let entry = new Entry(
        {
            body: req.body.body,
            time: req.body.time,
            date: new Date()
        }
    );

    entry.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Entry Created successfully')
    })
};


exports.entry_details = function (req, res, next) {
    Entry.findById(req.params.id, function (err, entry) {
        if (err) return next(err);
        //        res.send(entry);
        console.log(entry);
        res.render('home-page', {entry: entry});
    })
};


exports.entry_update = function (req, res) {
    Entry.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, entry) {
        if (err) return next(err);
        res.send('Entry udpated.');
    });
};


exports.entry_delete = function (req, res) {
    Entry.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};