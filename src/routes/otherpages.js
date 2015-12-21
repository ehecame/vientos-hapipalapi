var CategoryManager = require('./../managers/category');
var ProjectManager = require('./../managers/project');

module.exports = function () {
    return [
        {
            method: 'GET',
            path: '/prueba',
            handler: function (request, reply) {
                reply.view('prueba', null, { layout: 'prueba'});
            }
        }
    ];
}();