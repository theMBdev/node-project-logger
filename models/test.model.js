const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const TestSchema = new Scheme({
    
    date: {type: Date, default: Date.now, require: false},

    logArray: [{
        logname: String,
        totalHours: Number,
        totalMinutes: Number,
        posts: [{
            body: String,
            timeHour: Number,
            timeMinute: Number,
            date: Date
        }]
    }],    
});

module.exports = mongoose.model('Test', TestSchema);

