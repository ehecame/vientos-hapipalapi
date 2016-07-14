function ProjectManager () { }
ProjectManager.prototype = (function () {
  return {
    find: function find (db, query, fields , callback) {
      db.collection('projects').find(query, fields).toArray(function (err, docs) {
        callback(docs)
      })
    },
    findAll: function findAll (db, callback) {
      console.log('findAllProjects')
      db.collection('projects').find().sort({logo: -1}).toArray(function (err, docs) {
        console.log(docs.length)
        callback(docs)
      })
    },
    findAutogestival: function findAutogestival (db, callback) {
      db.collection('projects').find({'autogestival': 1}).toArray(function (err, docs) {
        callback(docs)
      })
    },
    findById: function findById (db, project_id, callback) {
      console.log(project_id)
      db.collection('projects').find({'_id': project_id}).toArray(function (err, docs) {
        console.log(docs)
        console.log(err)
        callback(docs)
      })
    },
    findByCategoryId: function findByCategoryId (db, category_id, callback) {
      db.collection('projects').find({'categories.catId': category_id}).sort({logo: -1}).toArray(function (err, docs) {
        callback(docs)
      })
    },
    findByKeyWords: function findByKeyWords (db, keyWords, callback) {
      var query = { $text: { $search: keyWords } }
      db.collection('projects').find(query).toArray(function (err, docs) {
        callback(docs)
      })
    },
    insert: function insert (db, project, callback) {
      console.log(project)
      db.collection('projects').insert(project, {w: 1}, function (err, doc) {
        console.log(doc)
        callback(doc)
      })
    },
    update: function update (db, updatedProject, id, callback) {
      db.collection('projects').update({ _id: id }, updatedProject, function (err, doc) {
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
