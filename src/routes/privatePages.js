var fs = require('fs')
var multiparty = require('multiparty')
var SessionController = require('./../controllers/session')
var UserManager = require('./../managers/user')

module.exports = function () {
  return [
    {
      method: 'GET',
      path: '/myprofile',
      config: {
        handler: function (request, reply) {
          var isAuthenticated = SessionController.isAuthenticated(request)
          if (isAuthenticated) {
            var credentials = SessionController.getSession(request)
            console.log(credentials)
            var db = request.mongo.db
            var query = {username: credentials.username}
            var fields = {}
            UserManager.find(db, query, fields, function (res) {
              var data = res[0]
              console.log(data)
              data.isAuthenticated = isAuthenticated
              data.withOutFooter = true
              data.credentials = credentials
              reply.view('userProfile', data)
            })
          } else {
            reply.redirect('/login?next=%2Fmyprofile')
          }
        },
        auth: {
          strategy: 'standard'
        }
      }
    },
    {
      method: 'GET',
      path: '/myprojects/pilot',
      config: {
        handler: function (request, reply) {
          var data = {
            isAuthenticated: SessionController.isAuthenticated(request)
          }
          if (data.isAuthenticated) {
            data.credentials = SessionController.getSession(request)
          }
          reply.view('projectProfile', data)
        },
        auth: {
          strategy: 'standard'
        }
      }
    }, {
      method: 'GET',
      path: '/register',
      config: {
        handler: function (request, reply) {
          var data = {
            isAuthenticated: SessionController.isAuthenticated(request)
          }
          if (data.isAuthenticated) {
            data.credentials = SessionController.getSession(request)
          }
          reply.view('register', data)
        },
        auth: {
          scope: 'admin'
        }
      }
    }, {
      method: 'GET',
      path: '/userregister',
      config: {
        handler: function (request, reply) {
          var data = {
            isAuthenticated: SessionController.isAuthenticated(request)
          }
          if (data.isAuthenticated) {
            data.credentials = SessionController.getSession(request)
          }
          reply.view('userRegister', data)
        },
        auth: {
          scope: 'admin'
        }
      }
    }
  ]
}()
