'use strict'
const Hapi = require('hapi')
var routes = require('./src/routes')
var credentials = require('./credentials.json')

const server = new Hapi.Server()

// Definición de puerto donde correrá el servidor
server.connection({
  port: credentials.server_port ,
  routes: { cors: { credentials: true}}
})

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

// Empezando servidor
server.start(function () {
  console.log('Server running at:', server.info.uri)
})

module.exports = server
