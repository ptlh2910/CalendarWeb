var router = require("express").Router();

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://sinno.soict.ai:27017";
// const uri = "mongodb://localhost:27017";
var _db;

MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    _db = db.db("CalendarDB");
});


function send_email(taikhoan, matkhau) {
    var mailOptions = {
        from: 'dchy2000@gmail.com',
        to: taikhoan,
        subject: 'This is your new password',
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

router.post('/', function (req, res) {
    var email = req.body.email
    // var password = req.cookies['password']
    var query = { "email": email };
    _db.collection("account").find(query).toArray(function (err, result) {
        if (err) throw err;
        if (results.length != 0) {
            console.log(results)
            send_email(email, 'Your password: ' + results[0]['password'])
            res.render("login", { thongBao: '', color: 'red' })
        } else {
            res.render('login', { thongBao: 'Error, email does not exist', color: 'red' })
        }
    })
});

module.exports = router;