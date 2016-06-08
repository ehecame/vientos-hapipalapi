var UserManager = require('./../../managers/user')
var Bcrypt = require('bcrypt-nodejs')

function UserController () { }
UserController.prototype = (function () {
  return {
    login: function login (request, reply) {
      UserManager.find(
        request.mongo.db,
        {username: request.payload.username},
        {},
        function (res) {
          if (res) {
            var user = res[0]
            Bcrypt.compareSync(request.payload.password, res[0].password, function (err, res) {
              if (res) {
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
        password: require('bcrypt-nodejs').hash(request.payload.password, 10),
        username: request.payload.username
      }
      var db = request.mongo.db
      UserManager.insert(db, newuser, function (res) {
        console.log(res)
        reply(res)
      })
    },
    logout: function logout (request, reply) {
      console.log('clearing cookie')
      request.cookieAuth.clear()
      request.auth.clear()
      return reply.redirect('/')
    }
  }
})()
var UserController = new UserController()
module.exports = UserController
