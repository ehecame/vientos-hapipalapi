function ProjectManager() { };
ProjectManager.prototype = (function () {
    return {
        findAll: function findAll(db, callback) {
            db.collection('projects').find().toArray(function (err, docs) {
                callback(docs);
            });
        },
        findByCategoryId: function findAll(db, category_id,callback) {
            db.collection('projects').find({"categories_ids": category_id}).toArray(function (err, docs) {
                callback(docs);
            });
        },
        findByKeyWords: function findAll(db, keyWords,callback) {
            console.log(keyWords);
            db.collection('projects').find( { $text: { $search: keyWords } } ).toArray(function (err, docs) {
                callback(docs);
            });
        },
        insert: function insert(db, project, callback) {
            console.log(project);
            db.collection('projects').insert(project, {w:1},function (err, doc) {
                callback(doc);
            });  
        },
        update: function update(db, updatedProject, id, callback) {
            db.collection('projects').update({ _id: id }, updatedProject, function (err, doc) {
                callback(doc);
            });  
        },
        delete: function (db, id, project, callback) {
            db.collection('projects').remove({ _id: id }, function (err, doc) {
                callback(doc);
            });  
        }
    }
})();

var ProjectManager = new ProjectManager();
module.exports = ProjectManager;