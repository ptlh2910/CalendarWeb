var router = require("express").Router();

var mongo = require('../database/db');
mongo.connectToServer();
var config = require('../configuration/config')

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'null.4207.01@gmail.com',
        pass: 'hien2304'
    }
});


function send_email(taikhoan, matkhau) {
    var mailOptions = {
        from: 'null.4207.01@gmail.com',
        to: taikhoan,
        subject: 'This is your new password:',
        text: matkhau
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

router.post('/send', function (req, res) {
    var username = req.body.username
    var pwd = req.body.password;
    var query = { "username": username };
    db = mongo.getDb();
    db.collection("account").find(query).toArray(function (err, result) {
        if (err) throw err;
        if (result.length != 0) {
            send_email(result[0].email, 'Your new password: ' + pwd)
            res.send({ "status": true, "message": 'Please check your mailbox to get a new password!', color: 'red' })
        } else {
            res.send({ "status": false, "message": 'Error, username does not exist', color: 'red' })
        }
    })
});

module.exports = router;

