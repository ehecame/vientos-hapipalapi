function CategoryManager() { };
CategoryManager.prototype = (function () {
    return {
        findAll: function findAll(db, callback) {
            db.collection('categories').find().toArray(function (err, docs) {
                callback(docs);
            });
        },
        insert: function insert(db, category, callback) {
            console.log(category);
            db.collection('categories').insert(category, {w:1},function (err, doc) {
                callback(doc);
            });  
        },
        update: function update(db, updatedCategory, id, callback) {
            db.collection('categories').update({ _id: id }, updatedCategory, function (err, doc) {
                callback(doc);
            });  
        },
        delete: function (db, id, category, callback) {
            db.collection('categories').remove({ _id: id }, function (err, doc) {
                callback(doc);
            });  
        }
    }
})();

var CategoryManager = new CategoryManager();
module.exports = CategoryManager;