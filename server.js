'use strict'
const Hapi = require('hapi')
var routes = require('./src/routes')
var credentials = require('./credentials.json')

const server = new Hapi.Server()

// Definición de puerto donde correrá el servidor
server.connection({ port: credentials.server_port })

// Datos de Configuración de Base de Datos
var dbOpts = {
  'url': credentials.mongo_url, // TODO debe de venir de ENV
  'decorate': true,
  'settings': {
    'db': {
      'native_parser': false
    }
  }
}

// Registro de plugin hapi-mongodb
server.register(
  {
    register: require('hapi-mongodb'),
    options: dbOpts
  },
  function (err) {
    if (err) {
      console.error(err)
      throw err
    }
  }
)

// Registro de plugin hapi-auth-cokie y definición de estrategia de autenticación
server.register(require('hapi-auth-cookie'), function (err) {
  server.auth.strategy('standard', 'cookie', true, { // if true, all routes have authentication by default
    password: credentials.cookie_pass, // TODO debe de venir de ENV
    cookie: 'sidVientos',
    redirectTo: '/login',
    isSecure: false,
    appendNext: true,
    clearInvalid: true,
    ttl: 43200000
  })
})

// Agregar todas las rutas al servidor
for (var route in routes) {
  console.log(route)
  server.route(routes[route])
}

// Registro de plugin vision y definición de configuración para Views y Layouts
server.register(require('vision'), function (err) {
  server.views({
    engines: {
      html: require('handlebars')
    },
    path: './src/views',
    layoutPath: './src/views/layout',
    layout: 'default',
    helpersPath: 'src/views/helpers'
  })
})

// Registro de plugin inert. SIN EL NO PUEDO HACER reply.file para staticFiles
server.register(require('inert') , function (err) {
  if (err) {
    console.error(err)
    throw err
  }
}
)

//Register raven service
if (credentials.sentry_dsn) {
  server.register({
    register: require('hapi-raven'),
    options: {
      dsn: credentials.sentry_dsn
    }
  }, (err) => {
    if (err) {
      console.log('Failed loading hapi-raven')
    }
  })
}

// Empezando servidor
server.start(function () {
  console.log('Server running at:', server.info.uri)
})

module.exports = server
