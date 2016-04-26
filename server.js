﻿'use strict'
const Hapi = require('hapi')
var routes = require('./src/routes')

const server = new Hapi.Server()

// Definición de puerto donde correrá el servidor
server.connection({ port: 3000 })

// Datos de Configuración de Base de Datos
var dbOpts = {
  'url': 'mongodb://localhost:27017/waacdb', // TODO debe de venir de ENV
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
  server.auth.strategy('standard', 'cookie', {
    password: 'Habiaunavezunaconstraseñamuydificildeadivinar', // TODO debe de venir de ENV
    cookie: 'sid-vientos',
    redirectTo: '/login',
    isSecure: false,
    appendNext: true
  })
})

// Definición para extra protección de authenticación por default y scope de Administrador
server.auth.default({
  strategy: 'standard'
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
    layout: 'default'
  })
})

// Registro de plugin inert
server.register(require('inert') , function (err) {
  if (err) {
    console.error(err)
    throw err
  }
}
)

// Empezando servidor 
server.start(function () {
  console.log('Server running at:', server.info.uri)
})

module.exports = server
