var express = require('express')
var passport = require('passport')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var router = express.Router();
var app = express()


app.set('views', __dirname + '/../views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', key: 'sid' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/../public'));


app.get('/', function(req, res) {
    req.logout();
    res.clearCookie("username");
    res.clearCookie("fullname");
    res.clearCookie("email");
    res.clearCookie("sdt");
    res.redirect('/');
});


module.exports = app;