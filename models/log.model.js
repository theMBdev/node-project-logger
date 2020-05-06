const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const LogSchema = new Scheme({
    name: String,
    entries: [{type: mongoose.Schema.Types.ObjectId, ref: 'Entry'}],
    user: mongoose.ObjectId,
    color: String
});


// Export the model
module.exports = mongoose.model('Log', LogSchema);

