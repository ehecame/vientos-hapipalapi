var _ = require('underscore')

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
      db.collection('projects').find().sort({pilot:1}).toArray(function (err, docs) {
        console.log(docs.length)
        callback(docs)
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
      db.collection('projects').find({'categories.catId': category_id}).sort({pilot: 1}).toArray(function (err, docs) {
        callback(docs)
      })
    },
    findByTypeId: function findByTypeId (db, type_id, callback) {
      db.collection('projects').find({'projectType.type': type_id}).sort({pilot:1}).toArray(function (err, docs) {
        callback(docs)
      })
    },
    findByCollaborationWay: function findByCollaborationWay (db, collaboration_type_id, callback) {
      db.collection('projects').find({$or: [{'needs.type': collaboration_type_id},{'offers.type': collaboration_type_id}]}).sort({pilot:1}).toArray(function (err, docs) {
        callback(docs)
      })
    },
    findByKeyWords: function findByKeyWords (db, keyWords, callback) {
      // var query = { $text: { $search: keyWords } } //3.2      
      // db.collection('projects').find(query).toArray(function (err, docs) {
      //  callback(docs)
      // })
      console.log(keyWords)
      var results = db.command({ text: 'projects', search: keyWords }, function (err, res) {
        console.log(err)
        console.log(res)
        callback(_.map(res.results, function (s) {return s.obj}))
      })
    },
    insert: function insert (db, project, callback) {
      console.log(project)
      db.collection('projects').insert(project, {w: 1}, function (err, doc) {
        console.log(doc)
        callback(doc)
      })
    },
    update: function update (db, query, updateObject, callback) {
      console.log(updateObject)
      console.log(query)
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
    },
    modifyOfferAndNeeds: function modifyOfferAndNeeds (db, callback) {
      var updatedNeeds, updatedOffers
      db.collection('projects').find({'needsa': {$exists: true}}).toArray(function (err, docs) {
        _.each(docs, function (project, index) {
          updatedNeeds = _.map(project.needsa, function (need) {return {'title': need, 'type': 'product'}})
          updatedOffers = _.map(project.offersa, function (offer) {return {'title': offer, 'type': 'product'}})
          db.collection('projects').updateMany({name: project.name}, {$set: {'needs': updatedNeeds}}, function (err, results) {
            console.log(results)})
          db.collection('projects').updateMany({name: project.name}, {$set: {'offers': updatedOffers}}, function (err, results) {
            console.log(results)})
        })
        callback()
      })
    }
  }
})()

var ProjectManager = new ProjectManager()
module.exports = ProjectManager
