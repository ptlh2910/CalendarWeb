var express = require('express')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var session = require('express-session')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var config = require('./configuration/config')
var mysql = require('mysql')
var app = express()
var register = require('./routes/register')
var logout = require('./routes/logout')
var saveProfile = require('./routes/saveProfile');
var auth = require('./routes/auth')
var update = require('./routes/update')
const { authenticate } = require('passport');
var get = require('./routes/get')
var forgot = require('./routes/send_email')

var mongoose = require('mongodb')

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

function check_email(email) {
    // checking existed, return length
    return 1;
};

// Passport session setup.
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', key: 'sid' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
    if (req.cookies.username === undefined) {
        res.render('index', {
            username: 'Canlendar will help your teams be more professional and do more' +
                'organize work and study in a more reasonable way'
        });
    } else {

    }
});

app.get('/forgot', function(req, res) {
    res.render('forgot')
});


// thiết lập sau khi đăng nhập bằng gmail
app.get('/gmail', function(req, res) {
    try {
    } catch {
    }
});

app.get('/home', function(req, res) {
    if (req.cookies.username === undefined) {
        res.redirect("/");
    } else {
        res.render('home', { fullname: req.cookies['fullname'] });
    }
});

// xử lý phần đăng nhập bằng facebook
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['profile', 'email'] }));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/facebook', failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    }
);

// thiết lập sau khi đăng nhập bằng facebook
app.get('/facebook', function(req, res) {
    res.render('home', { username: req.user.displayName });
});

// xử lý phần đăng nhập
app.use('/auth', auth)

// thiet lap chuc nang dang xuat
app.use('/logout', logout)

// thiet lap chuc nang login
app.get('/login.html', function(req, res) {
    res.render('login');
})

// get
app.use('/get', get)

// xử lý phần đăng kí
app.use('/register', register)

// chuc nang quen mat khau
app.use('/forgot', forgot)

module.exports = app;