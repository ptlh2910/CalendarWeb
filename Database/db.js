var config = require('../configuration/config')
//file: src/db.js
//Include mongoose library 
// const MongoClient = require('mongodb').MongoClient;

// MongoClient.connect(uri, function(err, db) {
//   if (err) throw err;
//   module.exports = db.db("CalendarDB");
// }); 

// Connection URL
const url = config.database_url;
const uri = "mongodb://sinno.soict.ai:27017";

// Database Name
const dbName = 'CalendarDB';

const MongoClient = require('mongodb').MongoClient; 
var _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
       if (err) throw err;
      _db  = client.db(dbName);
    } );
  },

  getDb: function() {
    return _db;
  }
};