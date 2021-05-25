var express = require('express')
var config = require('../configuration/config')
var router = express.Router()
var mongo = require('../database/db');
mongo.connectToServer();

router.post('/profile', function (req, res) {
    var query = req.body;
    db = mongo.getDb();
    db.collection("account").find(query).toArray(function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    });
});

router.post('/SubUser', function (req, res) {
    var query = req.body;
    db = mongo.getDb();
    db.collection("subcribe").find(query).toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

router.get('/email', function (req, res, next) {
    res.json({ 'email': req.cookies.email })
})

module.exports = router;