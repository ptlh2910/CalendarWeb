var express = require('express')
var passport = require('passport')
var session = require('express-session')
var cookieParser = require('cookie-parser')
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

app.post('/', function(req, res, next) {
    // lay sdt, fullname, email
    var sdt = req.body.phone
    var fullname = req.body.fullname
    var email = req.cookies.email
        // update co so du lieu
    connection.query('update accounts set fullname = ?, sdt = ? where email = ?', [fullname, sdt, email], function(error, results) {
        // neu khong thanh cong
        if (error) throw Error
            // neu thanh cong
        console.log('update success')
        res.cookie('sdt', sdt)
        res.cookie('fullname', fullname)
        res.render('profile', {
            fullname: fullname,
            email: email,
            sdt: sdt,
            profile: 'active',
            activity: '',
            card: '',
            setting: '',
            err: '',
            classProfile: 'tab-pane active',
            classActivity: 'container tab-pane fade',
            classCard: 'container tab-pane fade'
        })
    })
});

module.exports = app;