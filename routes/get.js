var express = require('express')
var router = express.Router()

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://sinno.soict.ai:27017";
// const uri = "mongodb://localhost:27017";
var _db;

MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    _db = db.db("CalendarDB");
});

router.post('/profile', function (req, res) {
    var query = req.body;
    _db.collection("account").find(query).toArray(function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    });
});

router.post('/SubUser', function (req, res) {
    var query = req.body;
    _db.collection("subcribe").find(query).toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

router.get('/email', function (req, res, next) {
    res.json({ 'email': req.cookies.email })
})

module.exports = router;