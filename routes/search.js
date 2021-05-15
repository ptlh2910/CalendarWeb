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
// const uri = "mongodb://localhost:27017";
var _db;

MongoClient.connect(uri, function(err, db) {
  if (err) throw err;
  _db = db.db("CalendarDB");
}); 

router.post('/profile', function(req, res) {
  var query = req.body;
  _db.collection("account").find(query).toArray(function(err, result) {
    if (err) throw err;
    if (result.length > 0){
    	res.send(result[0]);
    } else{
    	res.send(false);
    }
  });
});

module.exports = router;
