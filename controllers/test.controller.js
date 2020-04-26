const Entry = require('../models/entry.model');
const Log = require('../models/log.model');
const Test = require('../models/test.model');
const mdq = require('mongo-date-query');


var moment = require('moment');
moment().format();



exports.test_create = function (req, res, next) {

    let test = new Test(
        {      
            date: new Date(),
            logArray: [{
                logname: "OTHER LOG Log",
                totalHours: 2,
                totalMinutes: 15,
                posts: [{
                    body: "new body for the new log",
                    timeHour: 3,
                    timeMinute: 20,
                    date: new Date()
                }]
            }]              
        }
    );

    console.log("obj", test.logArray[0].posts);
    

    
    // TODO
    // AUTO FIND CORRECT LOG AND ADD POST
    // if log does not exist create log
    // if log does exist add post to log
    
    // New document for each day/date
    
    
    
    
//    // ADD NEW LOG WITHIN
//    Test.findOneAndUpdate({ _id: "5ea4f1e37b643b602c790b2b" }, { $push: { "logArray" : test.logArray } }, function (err, doc) {
//        if (err) {
//            console.log(err);
//        } else {
////            console.log(doc);
//            res.send(doc);
//        }
//    });    
    
    
    
//    // ADD NEW POST WITHING LOG
//    Test.findOneAndUpdate({ _id: "5ea4f1e37b643b602c790b2b", "logArray._id": "5ea4f1e37b643b602c790b2c" }, { $push: { "logArray.$.posts": test.logArray[0].posts  } }, function (err, doc) {
//        if (err) {
//            console.log(err);
//        } else {
////            console.log(doc);
//            res.send(doc);
//        }
//    });


    //// Finds all entries from last week BY DATE
    //    Test.find({ date: mdq.lastWeek()}, function(err, users){
    //        if(!err){
    //            console.log(users)
    //            res.send(users);
    //        }
    //    });

    //    // Basic find by id and update a part of the document
    //    Test.findById("5ea4f1e37b643b602c790b2b", function (err, doc) {
    //        if (err)
    //
    //            console.log(doc.logArray[0].posts);
    //
    //        doc.logArray[0].posts[0].body = 'jason bourne';
    //        doc.save();
    //
    //        res.send(doc.logArray[0].posts[0].body);
    //    });


                // saves as a new document with date
//                test.save(function (err, test) {
//                    if (err) {
//                        return next(err);
//                    }  
//            
//                    //        Log.findOne({name: req.body.logname}, function(err, log) {
//                    //
//                    //            log.entries.push(entry);
//                    //            log.save();
//                    //        });
//            
//            
//                    res.send(test);
//                })




};    
