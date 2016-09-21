function CodeManager() { };
CodeManager.prototype = (function () {
    return {
        insert: function insert(db, email, callback) {
            console.log(email)
            db.collection('subscribers').insert(email, {w:1},function (err, doc) {
                if(err)console.log(err)
                console.log(doc)
                callback(doc);
            });
        }
    }
})();

var CodeManager = new CodeManager();
module.exports = CodeManager;
