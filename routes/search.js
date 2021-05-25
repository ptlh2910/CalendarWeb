var express = require('express')
var passport = require('passport')
var cookieParser = require('cookie-parser')
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy
var config = require('../configuration/config')

var router = express.Router()
router.use(cookieParser());

var mongo = require('../database/db');
mongo.connectToServer();

router.post('/profile', function (req, res) {
    var query = req.body;
    db = mongo.getDb();
    db.collection("account").find(query).toArray(function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            res.send(result[0]);
        } else {
            res.send(false);
        }
    });
});

module.exports = router;
