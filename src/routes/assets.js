module.exports = function () {
	return [
		{
			method: 'GET',
			path: '/js/{file}',
			handler: function (request, reply) {
				reply.file("public/js/"+request.params.file+".js");
			}
		},{
			method: 'GET',
			path: '/css/{file}',
			handler: function (request, reply) {
				reply.file("public/css/"+request.params.file+".css");
			}
		},{
			method: 'GET',
			path: '/img/{file}',
			handler: function (request, reply) {
				reply.file("public/img/"+request.params.file);
			}
		},{
			method: 'GET',
			path: '/logo/{id}',
			handler: function (request, reply) {
				reply.file("public/img/"+request.params.id+"-logo.png");
			}
		},{
			method: 'GET',
			path: '/svg/{file}',
			handler: function (request, reply) {
				reply.file("public/svg/"+request.params.file+".svg");
			}
		},{
			method: 'GET',
			path: '/fonts/{file}',
			handler: function (request, reply) {
				reply.file("public/fonts/"+request.params.file);
			}
		}
	];
}();