var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.register(require('hapi-auth-cookie'), function (err) {

    server.auth.strategy('session', 'cookie', {
        password: 'secret',
        cookie: 'sid-example',
        redirectTo: '/login',
        appendNext: true,      // adds a `next` query value
        isSecure: false
    });
});

server.route([
    {
        method: 'GET',
        path: '/greetings',
        config: {
            auth: 'session',
            handler: function (request, reply) {

                reply('Hello there ' + request.auth.credentials.name);
            }
        }
    },
    {
        method: ['GET', 'POST'],
        path: '/login',
        config: {
            handler: function (request, reply) {

                if (request.method === 'post') {
                    request.auth.session.set({
                        name: 'John Doe'    // for example just let anyone authenticate
                    });

                    return reply.redirect(request.query.next); // perform redirect
                }

                reply('<html><head><title>Login page</title></head><body>' + 
                      '<form method="post"><input type="submit" value="login" /></form>' +
                      '</body></html>');
            },
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            }
        }
    }
]);

server.start(function (err) {

    if (err) {
        throw err;
    }

    console.log('Server started!');
});