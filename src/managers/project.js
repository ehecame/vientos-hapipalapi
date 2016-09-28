var _ = require('underscore')

function ProjectManager () { }
ProjectManager.prototype = (function () {
  return {
    find: function find (db, query, fields , callback) {
      db.collection('projects').find(query, fields).toArray(function (err, docs) {
        callback(orderAndShuflle(docs))
      })
    },
    findAll: function findAll (db, callback) {
      db.collection('projects').find().sort({pilot:-1}).toArray(function (err, docs) {
        callback(orderAndShuflle(docs))
      })
    },
    findAutogestival: function findAutogestival (db, callback) {
      db.collection('projects').find({'autogestival': 1}).toArray(function (err, docs) {
        callback(docs)
      })
    },
    findById: function findById (db, project_id, fields,callback) {
      db.collection('projects').findOne({'_id': project_id},fields, function (err, docs) {
        callback(docs)
      })
    },
    findByCategoryId: function findByCategoryId (db, category_id, callback) {
      db.collection('projects').find({'categories.catId': category_id}).sort({pilot: -1}).toArray(function (err, docs) {
        callback(orderAndShuflle(docs))
      })
    },
    findByTypeId: function findByTypeId (db, type_id, callback) {
      db.collection('projects').find({'projectType.type': type_id}).sort({pilot:-1}).toArray(function (err, docs) {
        callback(orderAndShuflle(docs))
      })
    },
    findByCollaborationWay: function findByCollaborationWay (db, collaboration_type_id, callback) {
      db.collection('projects').find({$or: [{'needs.type': collaboration_type_id},{'offers.type': collaboration_type_id}]}).sort({pilot:-1}).toArray(function (err, docs) {
        callback(orderAndShuflle(docs))
      })
    },
    findByKeyWords: function findByKeyWords (db, keyWords, callback) {
      // var query = { $text: { $search: keyWords } } //3.2
      // db.collection('projects').find(query).toArray(function (err, orderAndShuflle(docs)) {
      //  callback(docs)
      // })
      var results = db.command({ text: 'projects', search: keyWords }, function (err, res) {
        callback(_.map(res.results, function (s) {return s.obj}))
      })
    },
    insert: function insert (db, project, callback) {
      db.collection('projects').insert(project, {w: 1}, function (err, doc) {
        callback(doc)
      })
    },
    update: function update (db, query, updateObject, callback) {
      console.log(updateObject['$set'].schedule)
      db.collection('projects').update(query, updateObject, function (err, doc) {
        if(err)
          console.log(err)
        callback(doc)
      })
    },
    delete: function (db, id, callback) {
      db.collection('projects').remove({ _id: id }, function (err, doc) {
        callback(doc)
      })
    }
  }
})()

var ProjectManager = new ProjectManager()
module.exports = ProjectManager

function orderAndShuflle(projects){
  return _.chain(projects)
          .groupBy('pilot')
          .map(function(p){
            return _.shuffle(p)
          })
          .flatten()
          .value()
}
