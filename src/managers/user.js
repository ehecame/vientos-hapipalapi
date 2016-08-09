function UserManager () { }
UserManager.prototype = (function () {
  return {
    find: function find (db, query, fields , callback) {
      db.collection('users').find(query, fields).toArray(function (err, docs) {
        callback(docs)
      })
    },
    insert: function insert (db, user, callback) {
      console.log('insertingUser')
      console.log(user)
      db.collection('users').insert(user, {w: 1}, function (err, doc) {
        console.log(doc)
        callback(doc)
      })
    },
    update: function update (db, query, updateObject, callback) {
      console.log(updateObject)
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
