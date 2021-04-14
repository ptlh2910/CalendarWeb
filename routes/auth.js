var express = require('express')
var passport = require('passport')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy
var bodyParser = require('body-parser')
var config = require('../configuration/config')
var mysql = require('mysql');
var app = express()

app.set('views', __dirname + '/../views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', key: 'sid' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/../public'));

var connection = mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database
});
app.post('/', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
        console.log(username)
        res.render('home');
    } 
});

app.get('/google', passport.authenticate('google', { scope: 'email' }));
app.get('/google/callback',
    passport.authenticate('google', { successRedirect: '/gmail', failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    }
);
passport.use(new GoogleStrategy({
        clientID: config.googleClientID,
        clientSecret: config.googleClientSecret,
        callbackURL: config.callback_url_gmail
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

// thiet lap su dung dang nhap bang fb
app.get('/facebook', passport.authenticate('facebook', { scope: ['profile', 'email'] }));
app.get('/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/facebook', failureRedirect: '/login' }),
    function(req, res) {
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
    function(req, res, profile, done) {
        process.nextTick(function() {
            console.log(profile.displayName)

            if (config.use_database) {
                // if sets to true
                connection.query("SELECT * from accounts_FB where id = ?", profile.id, (error, results, fields) => {
                    if (error) throw error;
                    var user = {
                        'id': profile.id,
                        'username': profile.displayName
                    }

                    if (results.length == 0) {
                        // nếu chưa tồn tại
                        // thi them tai khoan moi
                        connection.query("INSERT INTO accounts_FB SET ?", user, function(error, results, fields) {});
                    }
                    // Nếu  tồn tại
                    else {
                        // console.log("User already exists in database");
                    }
                });
            }
            return done(null, profile);
        });
    }
));

module.exports = app;