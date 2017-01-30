const Hapi = require('hapi')
var routes = require('./src/routes')

const PORT = process.env.HAPI_PORT || 3000
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017'
const COOKIE_PASS = process.env.COOKIE_PASS || 'set me in COOKIE_PASS ENV variable'

const server = new Hapi.Server()

// Definición de puerto donde correrá el servidor
server.connection({
  port: PORT,
  routes: { cors: { credentials: true } }
})

// Datos de Configuración de Base de Datos
var dbOpts = {
  'url': MONGO_URL,
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
  if (err) throw err
  server.auth.strategy('standard', 'cookie', true, { // if true, all routes have authentication by default
    password: COOKIE_PASS,
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
  server.route(routes[route])
}

// Empezando servidor
server.start(function () {
  console.log('Server running at:', server.info.uri)
})

module.exports = server
