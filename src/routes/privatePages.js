var SessionController = require('./../controllers/session')
var UserManager = require('./../managers/user')

module.exports = function () {
  return [
    {
      method: 'GET',
      path: '/myprofile',
      config: {
        handler: function (request, reply) {
          var data = {
            isAuthenticated: SessionController.isAuthenticated(request)
          }
          if (data.isAuthenticated) {
            data.credentials = SessionController.getSession(request)
          }
          reply.view('userProfile', data)
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
    }
  ]
}()
