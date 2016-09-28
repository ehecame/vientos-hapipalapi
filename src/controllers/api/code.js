var CodeManager = require('./../../managers/code');

function CodeController() { };
CodeController.prototype = (function () {
    return {
        find: function find(request, reply) {
            var db = request.mongo.db;
            CodeManager.find(db, request.payload,{}, function (res) {
                reply(res);
            });
        },
        goodCode: function goodCode(request, reply) {
            var db = request.mongo.db;
            CodeManager.findOne(db, request.query.code, function (res) {
                if(res)
                    reply(true)
                else
                    reply(false)
            });
        },
        insert: function insert(request, reply) {
            var db = request.mongo.db
            var newCode = {
                code: Math.random().toString(36).slice(2),
            }
            if(request.payload && request.payload.projectId){
                newCode.projectLinked = request.payload.projectId
            }
            CodeManager.insert(db, newCode, function (res) {
                reply(newCode);
            })
        },
        delete: function (request, reply) {
            var db = request.mongo.db;
            CodeManager.delete(db, request.params.id, function (res) {
                reply(res);
            });
        }
    }
})();
var CodeController = new CodeController();
module.exports = CodeController;
