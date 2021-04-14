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
    // thiet lap views va public
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

app.post('/gmail', function(req, res) {

    connection.query('SELECT * FROM accounts WHERE username = ?', req.body.username, function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
            // kiem tra username da ton tai chua
            // neu da ton tai
            res.render('loginGmail', { check: 'Username already exitsts!' })
        } else {
            // neu chua ton tai
            var user = {
                    'username': req.body.username,
                    'password': req.body.password,
                    'email': req.user.emails[0]['value'],
                    'fullname': req.body.username
                }
                // insert vao database
            connection.query('INSERT INTO accounts SET ?', user, function(error, results, fields) {
                // neu khong thanh cong
                if (error) {
                    res.render('login', { thongBao: 'Error, please try again', color: 'red' })
                } else {
                    // neu thanh cong
                    // tim kiem bang co username va luu nhung gia tri cookie
                    connection.query('SELECT * FROM accounts WHERE username = ?', req.body.username, function(error, results, fields) {
                        // neu khong thanh cong
                        if (error) throw error;

                        // neu thanh cong va co ton tai tai khoan
                        if (results.length > 0) {
                            // luu vao cookie
                            res.cookie('username', req.body.username)
                            res.cookie('email', req.body.password)
                            res.cookie('sdt', results[0]['sdt'])
                            res.cookie('fullname', req.body.username)
                            res.render('home', { fullname: req.body.username })

                        } else {
                            // neu tai khong ton tai bao loi
                            res.render('login', { thongBao: 'Error login, please try again', color: 'red' })
                        }
                    });
                }
            })
        }
    });

});

app.post('/changePassword', function(req, res, next) {
    var passwordOld = req.body.passwordOld
    var passwordNew = req.body.passwordNew
    var email = req.cookies.email
    var confirm = req.body.confirm

    connection.query('SELECT accounts.password FROM accounts WHERE email = ?', email, function(error, results, fields) {
        // neu khong thanh cong
        if (error) throw error;

        var password = results[0]['password']
        console.log(password)
        console.log(results)
            // kiem tra password co giong password old khong
        if (password === passwordOld) {
            // neu bang kiem tra tiep password confirm co bang password new khong
            if (confirm === passwordNew) {
                // neu bang thi update du lieu
                connection.query('update accounts set password = ? where email = ?', [passwordNew, email], function(error, results) {
                    // neu khong thanh cong
                    if (error) throw Error
                        // neu thanh cong
                })
                res.render('login', { thongBao: 'Please login again to confirm', color: 'green' })
            } else {
                // neu khong bang thong bao loi
                res.render('profile', {
                    fullname: req.cookies.fullname,
                    email: req.cookies.email,
                    sdt: req.cookies.sdt,
                    profile: '',
                    activity: 'active',
                    card: '',
                    setting: '',
                    err: 'Password confirm incorrect, please try again!',
                    classProfile: 'container tab-pane fade',
                    classActivity: 'tab-pane active'
                })
            }
        } else {
            // password khong giong password old 
            res.render('profile', {
                fullname: req.cookies.fullname,
                email: req.cookies.email,
                sdt: req.cookies.sdt,
                profile: '',
                activity: 'active',
                card: '',
                setting: '',
                err: 'Password incorrect, please try again!',
                classProfile: 'container tab-pane fade',
                classActivity: 'tab-pane active'
            })
        }

    });

});

module.exports = app;