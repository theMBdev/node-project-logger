const express = require('express');
const bodyParser = require('body-parser');

const entry = require('./routes/entry.route');
const log = require('./routes/log.route'); 
const test = require('./routes/test.route'); 
const user = require('./routes/user.route')

var session = require('express-session');
var flash = require('express-flash');




//const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const conflash = require('connect-flash');

require('./config/passport')(passport);



const app = express();

var sessionStore = new session.MemoryStore;

app.use(session({
    cookie: { maxAge: 19000000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());
app.use(conflash());

var moment = require('moment');
moment().format();

app.use(express.static(__dirname + '/public'));


// 0 for dev mode
var mode = 1;

if (mode == 0) {
    // DEV
    var config = require('./config/config');
} else {
    // Heroku
    var config = require('./config/configForHeroku');
}

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
//app.use(expressLayouts);
app.set('view engine', 'ejs');


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/entry', entry);
app.use('/log', log);
app.use('/test', test);
app.use('/user', user);


app.use(function(req, res, next){
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('404', { url: req.url });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});


let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is up and running on port ' + port);
});

