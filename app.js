const express = require('express');
const bodyParser = require('body-parser');

const entry = require('./routes/entry.route');
const log = require('./routes/log.route'); 
const test = require('./routes/test.route'); 

var session = require('express-session');
var flash = require('express-flash');

const app = express();

var sessionStore = new session.MemoryStore;

app.use(session({
    cookie: { maxAge: 10000 },
    store: sessionStore,
    saveUninitialized: false,
    resave: 'false',
    secret: 'secret'
}));
app.use(flash());

var moment = require('moment');
moment().format();

app.use(express.static(__dirname + '/public'));


const config = require('./config/config');
mongodbUser = config.mongodbUser;
mongodbPassword = config.mongodbPassword;
dbString = config.dbString;

// Set up mongoose connection
const mongoose = require('mongoose');
let dbPath = 'mongodb://' + mongodbUser + ':' + mongodbPassword + dbString;

mongoose.connect(dbPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/entry', entry);
app.use('/log', log);
app.use('/test', test);

let port = 3000;

app.listen(port, () => {
    console.log('Server is up and running on port ' + port);
});

