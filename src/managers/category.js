function CategoryManager() { };
CategoryManager.prototype = (function () {
    return {
        findAll: function findAll(db, callback) {
            db.collection('categories').find().toArray(function (err, docs) {
                callback(docs);
            });
        },
        insert: function insert(db, category, callback) {
            db.collection('categories').insert(category, function (err, doc) {
                callBack(doc);
            });  
        },
        update: function update(db, updatedCategory, id, callback) {
            db.collection('categories').insert({ _id: id }, updatedCategory, function (err, doc) {
                callBack(doc);
            });  
        },
        delete: function (db, id, category, callback) {
            db.collection('categories').remove({ _id: id }, function (err, doc) {
                callBack(doc);
            });  
        }
    }
})();

var CategoryManager = new CategoryManager();
module.exports = CategoryManager;