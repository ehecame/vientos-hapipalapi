var CategoryManager = require('./../../managers/category');

function CategoryController() { };
CategoryController.prototype = (function () {
    return {
        findAll: function findAll(request, reply) {
            var db = request.server.plugins['hapi-mongodb'].db;  
            CategoryManager.findAll(db, function (res) {
                reply(res);
            });
        },
        insert: function insert(request, reply) {
            var db = request.server.plugins['hapi-mongodb'].db;
            var newCategory = {
                name: request.payload.name,
                language: requests.payload.language
            };  
            if(request.payload.parent){
                console.log(request.payload.parent);
            }
            CategoryManager.insert(db, function (res) {
                reply(res);
            });
        },
        update: function update(request, reply) {
            var db = request.server.plugins['hapi-mongodb'].db;  
            CategoryManager.update(db, request.payload.name, request.params.id, function (res) {
                reply(res);
            });
        },
        delete: function (request, reply) {
            var db = request.server.plugins['hapi-mongodb'].db;  
            CategoryManager.delete(db, request.params.id, function (res) {
                reply(res);
            });
        }
    }
})();
var CategoryController = new CategoryController();
module.exports = CategoryController;