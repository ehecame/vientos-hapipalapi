var ProjectManager = require('./../../managers/project');

function ProjectController() { };
ProjectController.prototype = (function () {
    return {
        findAll: function findAll(request, reply) {
            var db = request.server.plugins['hapi-mongodb'].db;  
            ProjectManager.findAll(db, function (res) {
                reply(res);
            });
        },
        findByCategoryId: function findAll(request, reply) {
            var db = request.server.plugins['hapi-mongodb'].db;  
            var objID = request.server.plugins['hapi-mongodb'].ObjectID;
            ProjectManager.findByCategoryId(db, new objID(request.params.category_id), function (res) {
                reply(res);
            });
        },
        findByKeyWords: function findAll(request, reply) {
            var db = request.server.plugins['hapi-mongodb'].db;  
            ProjectManager.findByKeyWords(db, request.params.keywords, function (res) {
                reply(res);
            });
        },
        insert: function insert(request, reply) {
            var db = request.server.plugins['hapi-mongodb'].db;
            console.log(request.payload);
            var newProject = {
                name: request.payload.name,
                description: request.payload.description,
                category_id: request.payload.category_id,
                address: request.payload.address,
                latitude: request.payload.latitude,
                longitude: request.payload.longitude,
                webpage: request.payload.webpage,
                facebook: request.payload.facebook
            };  
            ProjectManager.insert(db, newProject, function (res) {
                reply(res);
            });
        },
        update: function update(request, reply) {
            var db = request.server.plugins['hapi-mongodb'].db;  
            if(request.payload.parent){
                console.log(request.payload.parent);
            }
            else{
                console.log("no parent");
            }
            ProjectManager.update(db, updatedProject, function (res) {
                reply(res);
            });
        },
        delete: function (request, reply) {
            var db = request.server.plugins['hapi-mongodb'].db;  
            ProjectManager.delete(db, request.params.id, function (res) {
                reply(res);
            });
        }
    }
})();
var ProjectController = new ProjectController();
module.exports = ProjectController;