var UserManager = require('./../../managers/user')
var Bcrypt = require('bcrypt')

function UserController () { }
UserController.prototype = (function () {
  return {
    login: function login (request, reply) {
      console.log('controller login')
      UserManager.find(
        request.mongo.db,
        {username: request.payload.username},
        {},
        function (res) {
          console.log('project find login')
          console.log(res)
          if (res) {
            var user = res[0]
            Bcrypt.compare(request.payload.password, res[0].password, function (err, res) {
              if (res) {
                console.log(user)
                var account = {
                  username: request.payload.username,
                  email: user.email,
                  name: user.name,
                  lastname: user.lastname,
                  scope: user.scope
                }
                request.cookieAuth.set(account)
                return reply('success')
              } else {
                return reply('wrong password')
              }
            })
          } else {
            return reply('wrong username')
          }
        }
      )
    },
    register: function register (request, reply) {
      var newuser = {
        email: request.payload.email,
        password: require('bcrypt').hashSync(request.payload.password, 10),
        username: request.payload.username
      }
      var db = request.mongo.db
      UserManager.insert(db, newuser, function (res) {
        console.log(res)
        reply(res)
      })
    },
    logout: function logout (request, reply) {
      request.cookieAuth.clear()
      return reply.redirect('/')
    }
  }
})()
var UserController = new UserController()
module.exports = UserController
