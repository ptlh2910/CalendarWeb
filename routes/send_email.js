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

var nodemailer = require('nodemailer');
const { render, connect } = require('./register')
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'congnghewebnhom10@gmail.com',
        pass: 'congngheweb10'
    }
});

function send_email(taikhoan, matkhau) {
    var mailOptions = {
        from: 'congnghewebnhom10@gmail.com',
        to: taikhoan,
        subject: 'This is your new password',
        text: matkhau
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

app.post('/', function(req, res) {
    var email = req.body.email
        // var password = req.cookies['password']

    connection.query('select * from accounts where email = ?', email, (error, results, fields) => {
        if (results.length != 0) {
            console.log(results)
            send_email(email, 'Your password: ' + results[0]['password'])
            res.render("login", { thongBao: '', color: 'red' })
        } else {
            res.render('login', { thongBao: 'Error, email does not exist', color: 'red' })
        }
    })

});

module.exports = app;