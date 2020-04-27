const Entry = require('../models/entry.model');
const Log = require('../models/log.model');

var moment = require('moment');
moment().format();



exports.test = function (req, res) {
    res.send('Test controller!');
};

exports.entry_test = function(req, res) {

    //    res.send('Test controller!');

    Log.find({name: "Dev Log"}).populate("entries").exec((err, entries) => {


        console.log("cops " ,entries.entries[0]);
        console.log(entries);

        res.send(entries);


    })
}


exports.entry_find = function(req, res) {

    Entry.aggregate(
        [
            {

                $group: {

                    _id: { dateFormated: { $dateToString: { format: "%d-%m-%Y", date: "$date" }}, logname: "$logname"}, 

                },

                $group: {
                    _id: { 
                        dateFormated: {$dateToString: { format: "%d-%m-%Y", date: "$date"}},
                        logname: '$logname',
                    },

                    sumHour: {
                        $sum: '$timeHour'
                    },                     
                    sumMinute: {
                        $sum: '$timeMinute'
                    },

                    entries: {
                        $push: {
                            body: '$body',
                            logname: '$logname',
                            _id: '$_id',
                            timeHour: '$timeHour',
                            timeMinute: '$timeMinute',
                            date: '$date',
                            dateFormated: {$dateToString: { format: "%d-%m-%Y", date: "$date"}},
                        }
                    }
                }
            },

            { $sort: { 'entries.date' : -1 } },

        ],

        function(err, result) {
            if (err) {
                res.send(err);
            } else {
                //                                res.json(result);
                res.render('group-test', {entries: result, moment: moment});   
            }
        }
    );
};



exports.display = function (req, res) {

    // all logs
    Log.find({}).populate("entries").exec((err, entries) => {


        console.log("cops " ,entries.entries[1]);
        console.log(entries);

        res.render('new-page', {entries: entries, moment: moment});   

    })
}


exports.entry_create_view = function (req, res) {


    Log.find({}, (err, logs) => {

        //        console.log("cops " ,entries.entries[1]);
        console.log(logs);

        res.render('create-entry', {logs: logs, moment: moment});   

    })

};


exports.entry_create = function (req, res, next) {

    let entry = new Entry(
        {            
            logname: req.body.logname,
            body: req.body.body,
            timeHour: req.body.timeHour,
            timeMinute: req.body.timeMinute,
            date: new Date()
        }
    );

    entry.save(function (err, entry) {
        if (err) {
            return next(err);
        }  

        Log.findOne({name: req.body.logname}, function(err, log) {

            log.entries.push(entry);
            log.save();
        });


        res.redirect('find');
    })

};    



exports.entry_details = function (req, res, next) {
    Entry.findById(req.params.id, function (err, entry) {
        if (err) return next(err);

        console.log(entry);
        res.render('home-page', {entry: entry});
    })
};


// start view for update
exports.entry_update_view = function (req, res) {
    Entry.findById(req.params.id, function (err, entry) {
        if (err) return next(err);

        res.render('update-entry', {entry: entry});
    })
};


exports.entry_update = function (req, res) {
    Entry.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, entry) {
        if (err) return next(err);
        console.log(req.body);
        res.redirect('/entry/find');
    });
};


exports.entry_delete = function (req, res) {
    Entry.findById(req.params.id, function (err, entry) {
        if (err) return next(err);

        Log.findOneAndUpdate({name: entry.logname}, {new: true}, function (err, entry) {
            if (err) return next(err);

            // remove from log ref array
            entry.entries.pull(req.params.id);
            entry.save();

            Entry.findByIdAndRemove(req.params.id, function (err) {
                if (err) return next(err);  

                res.redirect('/entry/find');
            })

        });
    }
)}
