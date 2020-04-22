const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

let EntrySchema = new Scheme({
    body: {type: String, required: true, max: 100000},
    time: {type: String, required: false, max: 100},    
    // get from server
    date: {type: [Date], require: false},
    
    // log id to link to a log
    
});

// Export the model
module.exports = mongoose.model('Entry', EntrySchema);