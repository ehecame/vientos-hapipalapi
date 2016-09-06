var _ = require('lodash');
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27018/vientos-test'

MongoClient.connect(url, function(err, db) {
  var codesCol = db.collection("codes")
  _.each(codes, function(code){
    codesCol.insert({code: code}, function(res){console.log(res)})
  })
});

