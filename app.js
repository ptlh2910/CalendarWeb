var express = require('express')
var passport = require('passport')
// var FacebookStrategy = require('passport-facebook').Strategy
// var GoogleStrategy = require('passport-google-oauth20').Strategy;
var session = require('express-session')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var app = express()
var register = require('./routes/register')
var logout = require('./routes/logout')
var auth = require('./routes/auth')
// const { authenticate } = require('passport');
var get = require('./routes/get')
var forgot = require('./routes/send_email')
var home = require('./routes/home')
var profile = require('./routes/profile')
var update = require('./routes/update')
var getdata = require('./routes/get')
var search = require('./routes/search')
// var mongo = require('./Database/db');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://sinno.soict.ai:27017";
var _db;

MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    _db = db.db("CalendarDB");
});

// Passport session setup.
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client('43339122431-re8ubcvgrj5mim4ufqinsf5rlo82kbok.apps.googleusercontent.com');
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    if (req.cookies.username === undefined) {
        res.render('index', {
            title: 'Canlendar will help your teams be more professional and do more' +
                'organize work and study in a more reasonable way'
        });
    } else {
        res.render('index', {
            title: 'Canlendar will help your teams be more professional and do more' +
                'organize work and study in a more reasonable way'
        });

    }
});

app.get('/forgot', function (req, res) {
    res.render('forgot')
});
app.get('/home', checkAuthenticated, function (req, res) {

    _db.collection('account').insertOne(req.user, function (err, collection) {
        if (err) throw err;
        console.log("Record inserted Successfully");

    });
    res.render('home', req.user);
});
app.get('/profile', function (req, res) {
    res.render('profile')
});

app.get('/friend', function (req, res) {
    res.render('friend')
});

app.get('/changeprofile', function (req, res) {
    res.render('changeprofile')
});

// xử lý phần đăng nhập bằng facebook
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['profile', 'email'] }));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/facebook', failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    }
);
app.use(express.json());
app.use(cookieParser());

// xử lý phần đăng nhập
app.use('/auth', auth)

// thiet lap chuc nang dang xuat
app.use('/logout', logout)

app.get('/logout', (res, req) => {
    res.clearCookie('session-token')
    res.redirect('/login')
});

// thiet lap chuc nang login
app.get('/login', function (req, res) {
    res.render('login');
})

app.post('/login', (req, res) => {
    let token = req.body.token;
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '43339122431-re8ubcvgrj5mim4ufqinsf5rlo82kbok.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // console.log('payload ', payload )
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
    }
    verify()
        .then(() => {
            res.cookie('session-token', token);
            res.send('success');
        }).catch(console.error);
})

app.get('/protectedroute', (res, req) => {
    res.render('protectedroute.ejs')
})

app.get('/friend', (res, req) => {
    res.redirect('friend.ejs')
})

function checkAuthenticated(req, res, next) {
    let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '43339122431-re8ubcvgrj5mim4ufqinsf5rlo82kbok.apps.googleusercontent.com'

        });
        const payload = ticket.getPayload();
        user.username = payload.email.split('@')[0];
        user.fullname = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
        // console.log(user);
    }

    verify()
        .then(() => {
            req.user = user;
            next();
        })
        .catch(err => {
            res.redirect('/login');
        })
}


// get
app.use('/get', get)

// xử lý phần đăng kí
app.use('/register', register)

app.use('/home', home)

app.use('/profile', profile);

app.use('/update', update);

app.use('/getdata', getdata);

app.use('/search', search);
// chuc nang quen mat khau
app.use('/forgot', forgot)
// xu li profile
app.listen(3000, () => {
    console.log("server listen on port 3000!");
})