function CodeManager() { };
CodeManager.prototype = (function () {
    return {
        insert: function insert(db, email, callback) {
            db.collection('subscribers').insert(email, {w:1},function (err, doc) {
                if(err)console.log(err)
                callback(doc);
            });
        }
    }
})();

var CodeManager = new CodeManager();
module.exports = CodeManager;
