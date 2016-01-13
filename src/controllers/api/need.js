var NeedManager = require('./../../managers/need');

function NeedController() { };
NeedController.prototype = (function () {
    return {
        findAll: function findAll(request, reply) {
            var db = request.mongo.db;  
            NeedManager.findAll(db, function (res) {
                reply(res);
            });
        },
        findByCategories: function findByCategories(request, reply) {
            var db = request.mongo.db;  
            NeedManager.findByCategories(db, function (res) {
                reply(res);
            });
        },
        findByKeyWords: function findByKeyWords(request, reply) {
            var db = request.mongo.db;  
            NeedManager.findByKeyWords(db, function (res) {
                reply(res);
            });
        },
        findByCategoriesAndKeyWords: function findByCategoriesAndKeyWords(request, reply) {
            var db = request.mongo.db;  
            NeedManager.findByCategorAndKeyWords(db, function (res) {
                reply(res);
            });
        },
        findProjectNeeds: function findProjectNeeds(request, reply) {
            var db = request.mongo.db;  
            NeedManager.findProjectNeeds(db, function (res) {
                reply(res);
            });
        },
        insert: function insert(request, reply) {
            var db = request.mongo.db;
            var newNeed = {
                name: request.payload.name,
                description: request.payload.description,
                type_Id: request.payload.type_Id
            };  
            NeedManager.insert(db, newNeed, function (res) {
                reply(res);
            });
        },
        update: function update(request, reply) {
            var db = request.mongo.db;  
            NeedManager.update(db, updatedNeed, function (res) {
                reply(res);
            });
        },
        delete: function (request, reply) {
            var db = request.mongo.db;  
            NeedManager.delete(db, request.params.id, function (res) {
                reply(res);
            });
        }
    }
})();
var NeedController = new NeedController();
module.exports = NeedController;