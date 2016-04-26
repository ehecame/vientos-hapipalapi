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
          }
          console.log('reply index view')
          reply.view('index', data)
        }
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
          console.log(request.auth)
          if (request.auth.credentials) {
            console.log('credentials: ' + request.auth.credentials)
            data = {
              id: request.auth.credentials.id,
              name: request.auth.credentials.name
            }
          }
          reply.view('login', data)
        } /*,
        auth: false*/
      }
    }, {
      method: 'GET',
      path: '/logout',
      config: {
        handler: function (request, reply) {
          if (cookierequest.cookieAuth) {
            request.cookieAuth.clear()
          }
          reply.view('login')
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
