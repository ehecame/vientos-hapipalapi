function CodeManager() { };
CodeManager.prototype = (function () {
    return {
        findOne: function findOne(db, code, callback) {
            db.collection('codes').findOne({code: code},function (err, res) {
                callback(res);
            });
        },
        insert: function insert(db, code, callback) {
            console.log(code);
            db.collection('codes').insert(code, {w:1},function (err, doc) {
                callback(doc);
            });  
        },
        update: function update(db, updatedCode, id, callback) {
            db.collection('codes').update({ _id: id }, updatedCode, function (err, doc) {
                callback(doc);
            });  
        },
        delete: function (db, id, callback) {
            db.collection('codes').remove({ _id: id }, function (err, doc) {
                callback(doc);
            });  
        }
    }
})();

var CodeManager = new CodeManager();
module.exports = CodeManager;