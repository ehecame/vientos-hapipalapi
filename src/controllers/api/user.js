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
            var samePass = Bcrypt.compareSync(request.payload.password, user.password)
            if (samePass) {
              if (res) {
                var account = {
                  username: request.payload.username,
                  email: user.email,
                  name: user.name,
                  lastname: user.lastname,
                  scope: user.scope
                }
                console.log('buen log in')
                console.log(account)
                request.cookieAuth.set(account)
                return reply('success')
              } else {
                return reply('wrong password')
              }
            }
          } else {
            return reply('wrong username')
          }
        }
      )
    },
    register: function register (request, reply) {
      var newuser = {
        email: request.payload.email,
        password: require('bcrypt-nodejs').hashSync(request.payload.password, 10),
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
      request.auth.clear()
      return reply.redirect('/')
    }
  }
})()
var UserController = new UserController()
module.exports = UserController
