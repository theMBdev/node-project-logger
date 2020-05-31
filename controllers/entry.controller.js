const Entry = require('../models/entry.model');
const Log = require('../models/log.model');
const User = require('../models/user.model');

var moment = require('moment');
moment().format();



exports.test = function (req, res) {
    res.send('Test controller!');
};

exports.entry_test = function(req, res) {

    //    res.send('Test controller!');

    Log.find({name: "Dev Log"}).populate("entries").exec((err, entries) => {


        //        console.log("cops " ,entries.entries[0]);
        //        console.log(entries);

        res.send(entries);


    })
}


// only logged in user home page
exports.entry_find = function(req, res) {

    Entry.aggregate(
        [
            {
                //filter here for the logged in user
                $match : { user : req.user._id },

            },

            {
                "$lookup": {
                    "from": "logs",
                    "localField": "logname",
                    "foreignField": "name",
                    "as": "entry_doc"
                }
            },

            {                

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
                //                                console.log("dddd", res.json(result))
                res.render('group-test', {entries: result, moment: moment, expressFlashCreate: req.flash('create'), expressFlashUpdated: req.flash('update'), expressFlashDelete: req.flash('delete')});   
            }
        }
    );

};


exports.display = function (req, res) {

    // all logs
    Log.find({}).populate("entries").exec((err, entries) => {

        //        console.log("cops " ,entries.entries[1]);
        //        console.log(entries);

        res.render('new-page', {entries: entries, moment: moment});   

    })
}


exports.entry_create_view = function (req, res) {



    Log.find({user: req.user._id}, (err, logs) => {

        if(!logs[0]){
            return res.render('create-log', {logs: logs, moment: moment});   
        }

        res.render('create-entry', {logs: logs, moment: moment});   

    })

};


exports.entry_create = function (req, res, next) {


    const { logname, timeHour, timeMinute, body } = req.body;
    let errors = [];

    if (!logname || !timeHour || !timeMinute || !body ) {
        errors.push({ msg: 'Oops you forgot something' });

        if (errors.length > 0) {                

            Log.find({user: req.user._id}, (err, logs) => {

                res.render('create-entry', {logs: logs, moment: moment, errors, timeHour, timeMinute, body, logname});   

            })

        }


    } else {

        let entry = new Entry(
            {            
                logname: req.body.logname,
                body: req.body.body,
                timeHour: req.body.timeHour,
                timeMinute: req.body.timeMinute,
                user: req.user.id,
                date: new Date(),
            }
        );

        //    console.log(req.user);

        entry.save(function (err, entry) {
            if (err) {
                return next(err);
            }  


            Log.findOne({name: req.body.logname, user: req.user.id }, function(err, log) {

                //                console.log("User and log BEING INSTERTED", log)

                log.entries.push(entry);
                log.save();
            });


            req.flash('create', 'Entry Created');
            res.redirect('find');
        })

    }
};    





exports.entry_details = function (req, res, next) {

    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {


        Entry.findById(req.params.id, function (err, entry) {
            if (err) return next(err);

            //        console.log(entry);
            res.render('home-page', {entry: entry});
        });

    } else {
        //        res.send("Thats a bad id(ea)")
        res.render('500'); 
    }

};


// start view for update
exports.entry_update_view = function (req, res) {


    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {


        Entry.findById(req.params.id, function (err, entry) {
            if (err) return next(err);

            res.render('update-entry', {entry: entry});
        })

    } else {
        //        res.send("Thats a bad id(ea)")
        res.render('500'); 
    }

};


exports.entry_update = function (req, res) {

    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {

        Entry.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, entry) {
            if (err) return next(err);
            console.log(req.body);

            req.flash('update', 'Entry Updated');
            res.redirect('/entry/find');
        });

    } else {
        //        res.send("Thats a bad id(ea)");
        res.render('500'); 
    }  

};


exports.entry_delete = function (req, res) {

    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {

        Entry.findById(req.params.id, function (err, entry) {
            if (err) return next(err);

            Log.findOneAndUpdate({name: entry.logname}, {new: true}, function (err, entry) {
                if (err) return next(err);

                // remove from log ref array
                entry.entries.pull(req.params.id);
                entry.save();

                Entry.findByIdAndRemove(req.params.id, function (err) {
                    if (err) return next(err);  

                    req.flash('delete', 'Entry Deleted')
                    res.redirect('/entry/find');
                });
            });
        });
    } else {
        //        res.send("Thats a bad id(ea)")
        res.render('500');   

    } 
}

exports.entry_chart = function(req, res) {

    Entry.find({user: req.user.id}, function (err, entries) {
        //find entries    
//        console.log(entry[0].entries)
        res.render('chart', {entries: entries, moment: moment});   
    });
}
