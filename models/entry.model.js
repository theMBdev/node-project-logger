const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const EntrySchema = new Scheme({
    logname: {type: String, required: true, max: 100000},
    body: {type: String, required: true, max: 100000},
    timeHour: {type: Number, required: false, max: 10000},    
    timeMinute: {type: Number, required: false, max: 10000},
    // get from server
    date: {type: Date, default: Date.now, require: false},
    user: mongoose.ObjectId
});

module.exports = mongoose.model('Entry', EntrySchema);


