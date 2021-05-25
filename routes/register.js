var express = require('express')

var router = express.Router()

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://sinno.soict.ai:27017";
var _db;

MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    _db = db.db("CalendarDB");
});

var generated_ID = function () {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
};

router.post('/addUser', function (req, res) {
    var confirm = req.body.confirm
    var username = req.body.username
    var password = req.body.password
    var phone = req.body.phone
    var email = req.body.email

    var data = {
        "id": generated_ID,
        "username": username,
        "email": email,
        "password": password,
        "phone": phone
    }
    if (password == confirm) {
        var query = { username: username };
        _db.collection("account").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                _db.collection('account').insertOne(data, function (err, collection) {
                    if (err) throw err;
                    console.log("Record inserted Successfully!");

                });
                res.render('home', data);
            } else {
            }
        });
    } else {

    }

});

module.exports = router;