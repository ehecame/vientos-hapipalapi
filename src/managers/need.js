function NeedManager() { };
NeedManager.prototype = (function () {
    return {
        findAll: function findAll(db, callback) {
            db.collection('project.needs').find().toArray(function (err, docs) {
                callback(docs);
            });
        },
        findByCategories: function findByCategories(db, callback) {
            db.collection('project.needs').find().toArray(function (err, docs) {
                callback(docs);
            });
        },
        findByKeyWords: function findByKeyWords(db, callback) {
            db.collection('project.needs').find().toArray(function (err, docs) {
                callback(docs);
            });
        },
        findByCategoriesAndKeyWords: function findByCategoriesAndKeyWords(db, callback) {
            db.collection('project.needs').find().toArray(function (err, docs) {
                callback(docs);
            });
        },
        findProjectNeeds: function findProjectNeeds(db, callback) {
            db.collection('project.needs').find().toArray(function (err, docs) {
                callback(docs);
            });
        },
        insert: function insert(db, need, callback) {
            console.log(need);
            db.collection('project.needs').insert(need, {w:1},function (err, doc) {
                callback(doc);
            });  
        },
        update: function update(db, updatedNeed, id, callback) {
            db.collection('project.needs').update({ _id: id }, updatedNeed, function (err, doc) {
                callback(doc);
            });  
        },
        delete: function (db, id, need, callback) {
            db.collection('project.needs').remove({ _id: id }, function (err, doc) {
                callback(doc);
            });  
        }
    }
})();

var NeedManager = new NeedManager();
module.exports = NeedManager;