var express = require('express')
var router = express.Router()

var mongo = require('../database/db');
mongo.connectToServer();

router.post('/profile', function (req, res) {
    var query = req.body;
    db = mongo.getDb();
    db.collection("account").update(
        { "username": query["username"] },
        query,
        { upsert: true }
    );
    console.log("Update successful!")
});

router.post('/event', function (req, res) {
    var query = req.body;
    db = mongo.getDb();
    db.collection("event").deleteMany({ "id": query["id"] });
    db.collection("event").insertOne(query, function (err, collection) {
        if (err) throw err;
    });;
    console.log("Update successful!")
});

module.exports = router;