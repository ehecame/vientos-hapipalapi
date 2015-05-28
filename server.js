var Hapi = require('hapi');
var routes = require('./src/routes');

var server = new Hapi.Server();
server.connection({ port: 3000 });

var dbOpts = {
    "url": "mongodb://localhost:27017/waacdb",
    "settings": {
        "db": {
            "native_parser": false
        }
    }
};

server.register(
    {
        register: require('hapi-mongodb'),
        options: dbOpts
    }, 
    function (err) {
        if (err) {
            console.error(err);
            throw err;
        }
    }
);
    
for (var route in routes) {
    console.log(route);
    server.route(routes[route]);
};

server.views({
    engines: {
        html: require('handlebars')
    },
    path: './src/views',
    layoutPath: './src/views/layout',
    layout: 'default'
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});