const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
    logs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Log'}]
});

module.exports = mongoose.model('User', UserSchema);
