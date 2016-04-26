var CategoryManager = require('./../managers/category')
var ProjectManager = require('./../managers/project')
var SessionController = require('./../controllers/session')

module.exports = function () {
  return [
    {
      method: 'GET',
      path: '/',
      config: {
        handler: function (request, reply) {
          console.log('/ handler')
          var data = {
            isAuthenticated: SessionController.isAuthenticated(request)
          }
          if (data.isAuthenticated) {
            data.credentials = SessionController.getSession(request)
            console.log(data.credentials)
          }
          console.log('reply index view')
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
      path: '/project/profile/{project_id}',
      handler: function (request, reply) {
        var db = request.mongo.db
        var objID = request.mongo.ObjectID
        ProjectManager.findById(db, objID(request.params.project_id), function (res) {
          var data = res[0]
          console.log(data)
          reply.view('projectProfile', data)
        })
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
          reply.view('map')
        }
      }
    }, {
      method: 'GET',
      path: '/register',
      handler: function (request, reply) {
        reply.view('register')
      }
    }, {
      method: 'GET',
      path: '/needs',
      handler: function (request, reply) {
        reply.view('needs')
      }
    }, {
      method: 'GET',
      path: '/login',
      config: {
        handler: function (request, reply) {
          var data = {}
          // if (request.auth.credentials) {
          //   console.log('credentials: ' + request.auth.credentials)
          //   data = {
          //     id: request.auth.credentials.id,
          //     name: request.auth.credentials.name
          //   }
          // }
          reply.view('login', data)
        },
        auth: {
          mode: 'try'
        },
        plugins: { 'hapi-auth-cookie': {redirectTo: false}}
      }
    }, {
      method: 'GET',
      path: '/logout',
      config: {
        handler: function (request, reply) {
          console.log('log out path handler')
          console.log(request.auth.isAuthenticated)
          console.log(request.cookieAuth)
          if (request.auth.isAuthenticated) {
            console.log('clearingCookie')
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
    }
  ]
}()
