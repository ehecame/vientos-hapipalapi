function ProjectManager() { };
ProjectManager.prototype = (function () {
    return {
        find: function find(db, query, fields , callback){
            db.collection('projects').find(query, fields).toArray(function (err,docs){
                callback(docs);
            });
        },
        findAll: function findAll(db, callback) {
            db.collection('projects').find().toArray(function (err, docs) {
                callback(docs);
            });
        },     
        findAutogestival: function findAutogestival(db, callback) {
            db.collection('projects').find({"autogestival": 1}).toArray(function (err, docs) {
                callback(docs);
            });
        },   
        findById: function findAll(db, project_id,callback) {
            db.collection('projects').find({"_id": project_id}).toArray(function (err, docs) {
                callback(docs);
            });
        },
        findByCategoryId: function findAll(db, category_id,callback) {
            db.collection('projects').find({"categories_ids": category_id}).toArray(function (err, docs) {
                callback(docs);
            });
        },
        findByKeyWords: function findAll(db, keyWords,callback) {
            var query =  { $text: { $search: keyWords } } ;
            db.collection('projects').find(query).toArray(function (err, docs) {
                callback(docs);
            });
        },
        insert: function insert(db, project, callback) {
            console.log(project);
            db.collection('projects').insert(project, {w:1},function (err, doc) {
                console.log(doc);               
                callback(doc);
            });  
        },
        update: function update(db, updatedProject, id, callback) {
            db.collection('projects').update({ _id: id }, updatedProject, function (err, doc) {
                callback(doc);
            });  
        },
        delete: function (db, id, callback) {
            db.collection('projects').remove({ _id: id }, function (err, doc) {
                callback(doc);
            });  
        }
    }
})();

var ProjectManager = new ProjectManager();
module.exports = ProjectManager;