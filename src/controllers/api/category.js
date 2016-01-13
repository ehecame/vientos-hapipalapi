var CategoryManager = require('./../../managers/category');

function CategoryController() { };
CategoryController.prototype = (function () {
    return {
        findAll: function findAll(request, reply) {
            var db = request.mongo.db;  
            CategoryManager.findAll(db, function (res) {
                reply(res);
            });
        },
        insert: function insert(request, reply) {
            var db = request.mongo.db;
            var newCategory = {
                name: request.payload.name,
                language: request.payload.language
            };  
            if(request.payload.parent){
                console.log(request.payload.parent);
            }
            else{
                console.log("no parent");
            }
            CategoryManager.insert(db, newCategory, function (res) {
                reply(res);
            });
        },
        update: function update(request, reply) {
            var db = request.mongo.db;  
            if(request.payload.parent){
                console.log(request.payload.parent);
            }
            else{
                console.log("no parent");
            }
            CategoryManager.update(db, updatedCategory, function (res) {
                reply(res);
            });
        },
        delete: function (request, reply) {
            var db = request.mongo.db;  
            CategoryManager.delete(db, request.params.id, function (res) {
                reply(res);
            });
        }
    }
})();
var CategoryController = new CategoryController();
module.exports = CategoryController;