var CategoryManager = require('./../managers/category')
var ProjectManager = require('./../managers/project')
var SessionController = require('./../controllers/session')
var Bcrypt = require('bcrypt-nodejs')

module.exports = function () {
  return [
    {
      method: 'GET',
      path: '/',
      config: {
        handler: function (request, reply) {
          var data = {
            isAuthenticated: SessionController.isAuthenticated(request),
            withOutFooter: true
          }
          if (data.isAuthenticated) {
            data.credentials = SessionController.getSession(request)
          }
          var x = require('bcrypt-nodejs').hashSync('ericeric')
          console.log(x)
          reply.view('index', data)
        },
        auth: {
          mode: 'try',
          strategy: 'standard'
        },
        plugins: { 'hapi-auth-cookie': { redirectTo: false } }
      }
    }, {
      method: 'GET',
      path: '/search',
      handler: function (request, reply) {
        var db = request.mongo.db
        CategoryManager.findAll(db, function (res) {
          var data = {
            categories: res
          }
          console.log(data)
          reply.view('search', data)
        })
      }
    }, {
      method: 'GET',
      path: '/about',
      handler: function (request, reply) {
        reply.view('about')
      }
    }, {
      method: 'GET',
      path: '/map',
      config: {
        handler: function (request, reply) {
          var data = {
            isAuthenticated: SessionController.isAuthenticated(request)
          }
          if (data.isAuthenticated) {
            data.credentials = SessionController.getSession(request)
          }
          reply.view('map', data)
        }
      // auth: false
      }
    }, {
      method: 'GET',
      path: '/register',
      handler: function (request, reply) {
        reply.view('register')
      }
    }, {
      method: 'GET',

      path: '/howtocolaborate',
      handler: function (request, reply) {
        reply.view('howToColaborate')
      }
    }, {
      method: 'GET',
      path: '/login',
      config: {
        handler: function (request, reply) {
          var data = {}
          console.log('redirectTo:')
          console.log(request.query)
          data.redirect = request.query.next ? request.query.next : '/myprofile'
          // if (request.auth.credentials) {
          //   console.log('credentials: ' + request.auth.credentials)
          //   data = {
          //     id: request.auth.credentials.id,
          //     name: request.auth.credentials.name
          //   }
          // }

          reply.view('login', data)
        },
        auth: false
      }
    }, {
      method: 'GET',
      path: '/logout',
      config: {
        handler: function (request, reply) {
          if (request.auth.isAuthenticated) {
            request.cookieAuth.clear()
          }
          reply.redirect('/')
        }
      }
    }, {
      method: 'GET',
      path: '/shortregister',
      config: {
        handler: function (request, reply) {
          reply.view('shortRegister')
        } /*,
        auth: false*/
      }
    }, {
      method: 'GET',
      path: '/project/pilot',
      config: {
        handler: function (request, reply) {
          reply.view('projectProfile')
        } /*,
        auth: false*/
      }
    }
  ]
}()
