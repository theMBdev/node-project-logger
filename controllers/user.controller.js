const User = require('../models/user.model');

const bcrypt = require('bcryptjs');
const passport = require('passport');

var moment = require('moment');
moment().format();

exports.user_dashboard = function(req, res) {
    res.render('dashboard', {
        user: req.user
    })
};

exports.user_login_view = function(req, res) {
    res.render('login');
};

exports.user_register_view = function(req, res) {
    res.render('register');
};


exports.user_register = function(req, res) {
    const { email, password, password2 } = req.body;
    let errors = [];

    if (!email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            email,
            password,
            password2
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('register', {
                    errors,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                            req.flash(
                                'success_msg',
                                'You are now registered and can log in'
                            );
                            res.redirect('/user/login');
                        })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
};


exports.user_login = function(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/entry/find',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
};

exports.user_logout = function(req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login');
};





