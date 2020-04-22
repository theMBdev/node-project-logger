const express = require('express');
const bodyParser = require('body-parser');

const entry = require('./routes/entry.route'); // Imports routes for the entry
const config = require('./config/config');
const app = express();

var moment = require('moment');
moment().format();



mongodbUser = config.mongodbUser;
mongodbPassword = config.mongodbPassword;
dbString = config.dbString;

// Set up mongoose connection
const mongoose = require('mongoose');
let dbPath = 'mongodb://' + mongodbUser + ':' + mongodbPassword + dbString;
let mongoDB = process.env.MONGODB_URI || dbPath;
//mongoose.connect(dbPath, {
//    useNewUrlParser: true,
//    useUnifiedTopology: true
//});










mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/entry', entry);

let port = 3000;

app.listen(port, () => {
    console.log('Server is up and running on port ' + port);
});

