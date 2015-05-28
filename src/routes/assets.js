module.exports = function () {
	return [
		{
			method: 'GET',
			path: '/js/{file}',
			handler: function (request, reply) {
				console.log("js " + request.params.file);
				reply.file("public/js/"+request.params.file+".js");
			}
		},{
			method: 'GET',
			path: '/css/{file}',
			handler: function (request, reply) {
				console.log("css " + request.params.file);
				reply.file("public/css/"+request.params.file+".css");
			}
		},{
			method: 'GET',
			path: '/img/{file}',
			handler: function (request, reply) {
				reply.file("public/img/"+request.params.file);
			}
		}
	];
}();