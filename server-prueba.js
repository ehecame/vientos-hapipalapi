var Hapi = require('hapi')

var server = new Hapi.Server()
server.connection({ port: 3000 })

var dbOpts = {
  'url': 'mongodb://localhost:27018/vientos-test', // TODO debe de venir de config-file
  'decorate': true,
  'settings': {
    'db': {
      'native_parser': false
    }
  }
}

server.register(require('hapi-auth-cookie'), function (err) {
  server.auth.strategy('session', 'cookie', {
    password: 'secret',
    cookie: 'sid-example',
    redirectTo: '/login',
    appendNext: true, // adds a `next` query value
    isSecure: false
  })
})

server.route([
  {
    method: 'GET',
    path: '/hola',
    config: {
      auth: 'session',
      handler: function (request, reply) {
        reply('Hello there ' + request.auth.credentials.name)
      }
    }
  },
  {
    method: 'GET',
    path: '/error',
    config: {
      handler: function (request, reply) {
        reply('ERROR')
      }
    }
  },
  {
    method: ['GET', 'POST'],
    path: '/login',
    config: {
      handler: function (request, reply) {
        if (request.method === 'post') {
          request.mongo.db.collections('user').find({username: request.payload.username}).toArray(function (err, docs) {
            if (docs) {
              console.log('existe usuario')
              if (docs[0].password2 == request.payload.password) {
                request.cookieAuth.set({
                  name: docs[0].name, // for example just let anyone authenticate
                  name: docs[0].lastname // for example just let anyone authenticate
                })
                return reply.redirect('/hola') // perform redirect
              } else {
                return reply.redirect('/error')
              }
            } else {
              return reply.redirect('/error')
            }
          })
        }

        reply(
          '<html><head><title>Login page</title></head><body>' +
          '<form method="post">' +
          '<div><label for="usernameInput">UserName</label><input id="usernameInput" type="text" name="username" /></div>' +
          '<div><label for="passwordInput">UserName</label><input id="passwordInput" type="password" name="password" /></div>' +
          '<input type="submit" value="login" /></form>' +
          '</body></html>')
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
])

server.on('response', function (request) {
  console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.url.path + ' --> ' + request.response.statusCode)
})

server.start(function (err) {
  if (err) {
    throw err
  }

  console.log('Server started!')
})
