const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const LogSchema = new Scheme({
    name: String,
    entries: [{type: mongoose.Schema.Types.ObjectId, ref: 'Entry'}]
});


// Export the model
module.exports = mongoose.model('Log', LogSchema);