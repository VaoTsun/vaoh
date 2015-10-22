var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var murl = 'mongodb://localhost:27017/admin';
/*
MongoClient.connect(murl, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  db.close();
});
*/