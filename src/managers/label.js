function LabelManager() { };
LabelManager.prototype = (function () {
    return {
        findAll: function findAll(db, callback) {
            db.collection('labels').find().toArray(function (err, docs) {
                callback(docs);
            });
        },
        findByLanguage: function findByLanguage(db, language, callback){
            db.collection('labels').find({"language": language}).toArray(function(err, docs){
                callback(docs);
            });
        },
        insert: function insert(db, category, callback) {
            console.log(category);
            db.collection('labels').insert(category, {w:1},function (err, doc) {
                callback(doc);
            });  
        },
        update: function update(db, updatedCategory, id, callback) {
            db.collection('labels').update({ _id: id }, updatedCategory, function (err, doc) {
                callback(doc);
            });  
        },
        delete: function (db, id, category, callback) {
            db.collection('labels').remove({ _id: id }, function (err, doc) {
                callback(doc);
            });  
        }
    }
})();

var LabelManager = new LabelManager();
module.exports = LabelManager;