function UserManager () { }
UserManager.prototype = (function () {
  return {
    find: function find (db, query, fields , callback) {
      db.collection('users').find(query, fields).toArray(function (err, docs) {
        callback(docs)
      })
    },
    findOne: function findOne (db, query, fields , callback) {
      db.collection('users').findOne(query, fields, function (err, doc) {
        callback(doc)
      })
    },
    insert: function insert (db, user, callback) {
      db.collection('users').insert(user, {w: 1}, function (err, doc) {
        callback(doc)
      })
    },
    update: function update (db, query, updateObject, callback) {
      db.collection('users').update(query, updateObject, function (err, doc) {
        callback(doc)
      })
    },
    delete: function (db, id, callback) {
      db.collection('users').remove({ _id: id }, function (err, doc) {
        callback(doc)
      })
    }
  }
})()

var UserManager = new UserManager()
module.exports = UserManager
