var router = require("express").Router();

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://sinno.soict.ai:27017";
// const uri = "mongodb://localhost:27017";
var _db;

MongoClient.connect(uri, function(err, db) {
  if (err) throw err;
  _db = db.db("CalendarDB");
}); 


router.post('/addEvent', function(req, res) {
    var data = req.body;
    _db.collection("event").insertOne(data,function(err, collection) {
      if (err) throw err;
    });
    res.send(true);
});

router.post('/addSubUser', function(req, res) {
    var data = req.body;
    _db.collection("subcribe").insertOne(data,function(err, collection) {
      if (err) throw err;
    });
    console.log("insert successful!");
    res.send(true);
});
router.post('/delSubUser', function(req, res) {
    var query = req.body;
    _db.collection("subcribe").deleteMany(query);
    console.log("delete successful!");
    res.send(true);
});

router.post('/checkEvent', function(req, res) {
    var query = req.body;
    _db.collection("event").find(query).toArray(function(err, result) {
      if (err) throw err;
      res.send(result);
    });
});

router.post('/getEvent', function(req, res) {
  var query = req.body;
  _db.collection("event").find(query).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});

router.post('/getEvents', function(req, res) {
  var query = req.body.ids;
  // console.log(_db);
  _db.collection("event").find({
    $or: query
  }).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});

router.post('/deleteEvent', function(req, res) {
    var id = req.body.id;
    var query = { "id" : id};
    console.log(req.body);
    _db.collection("event").remove(query);
});

module.exports = router;