

module.exports = function () {
    return [
        {
            method: 'GET',
            path: '/',
            handler: function (request, reply) {
            	var data = {
	                title: 'This is Index!',
	                message: 'Hello, World. You crazy handlebars layout'
	            };
                reply.view('home', data);
            }
        },{
            method: 'GET',
            path: '/search',
            handler: function (request, reply) {
                var data = {
                    title: 'This is Index!',
                    message: 'Hello, World. You crazy handlebars layout'
                };
                reply.view('search', data);
            }
        }
    ];
}();