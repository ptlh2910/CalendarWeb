var express = require('express')
var router = express.Router()
var mongo = require('../database/db');
mongo.connectToServer();

var generated_ID = function () {
    var id = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
    return id;
};

router.post('/addUser', function (req, res) {
    var confirm = req.body.confirm
    var username = req.body.username
    var password = req.body.password
    var phone = req.body.phone
    var email = req.body.email

    var data = {
        "id": generated_ID(),
        "username": username,
        "email": email,
        "password": password,
        "phone": phone
    }
    if (password == confirm) {
        var query = { username: username };
        db = mongo.getDb();
        db.collection("account").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                db.collection('account').insertOne(data, function (err, collection) {
                    if (err) throw err;
                    console.log("Record inserted Successfully!");

                });


                res.send({ "message": "Sign up successfully!", 'data': data });
            } else {
                res.send({ "message": "The username were existed" });
            }
        });
    } else {
        res.send({ "message": "The confirm password is invalid! Try again!" })
    }

});

module.exports = router;