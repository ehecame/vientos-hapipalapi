var CategoryManager = require('./../managers/category');
var ProjectManager = require('./../managers/project');
var LabelManager = require('./../managers/label');

module.exports = function () {
    return [
        {
            method: 'GET',
            path: '/prueba/{lang?}',
            handler: function (request, reply) {
            	var lang = request.params.lang ? request.params.lang : "es";
            	console.log("language:" + lang);
            	var db = request.mongo.db;
                var objID = request.mongo.ObjectID;
                LabelManager.findByLanguage(db, lang,function(res){
                    var data = res[0];
                    console.log(data);
                    reply.view('prueba', data, { layout: 'prueba'});
                });                
            }
        }
    ];
}();