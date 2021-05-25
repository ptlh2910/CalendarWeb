var express = require('express')
var passport = require('passport')
var cookieParser = require('cookie-parser')
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy
var config = require('../configuration/config')

var router = express.Router()
router.use(cookieParser());

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://sinno.soict.ai:27017";

router.post('/', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db("CalendarDB");
            var query = { username: username, password: password };
            dbo.collection("account").find(query).toArray(function (err, result) {
                if (err) throw err;
                db.close();
                if (result.length > 0) {
                    res.render('home', { username: username });
                } else {
                    res.render('login', { thongBao: 'Error login, please try again', color: 'red' })
                }
            });
        });
    }
});

router.get('/google', passport.authenticate('google', { scope: 'email' }));
router.get('/google/callback',
    passport.authenticate('google', { successRedirect: '/gmail', failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    }
);

passport.use(new GoogleStrategy({
    clientID: config.googleClientID,
    clientSecret: config.googleClientSecret,
    callbackURL: config.callback_url_gmail
},
    function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

// thiet lap su dung dang nhap bang fb
router.get('/facebook', passport.authenticate('facebook', { scope: ['profile', 'email'] }));
router.get('/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/facebook', failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    }
);

// sử dụng  FacebookStrategy trong Passport.
passport.use(new FacebookStrategy({
    // thiết lập các cấu hình cần thiết
    clientID: config.facebook_api_key,
    clientSecret: config.facebook_api_secret,
    callbackURL: config.callback_url_facebook
},
    function (req, res, profile, done) {
        process.nextTick(function () {
            console.log(profile.displayName)
        });
    }
));

module.exports = router;