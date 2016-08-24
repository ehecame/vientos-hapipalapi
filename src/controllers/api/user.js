var UserManager = require('./../../managers/user')
var SessionController = require('./../session')
var qs = require('qs')
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
          if (res.length > 0) {
            var user = res[0]
            var samePass = Bcrypt.compareSync(request.payload.password, user.password)
            if (samePass) {
              if (res) {
                var account = {
                  username: request.payload.username,
                  email: user.email,
                  name: user.name,
                  lastname: user.lastname,
                  scope: user.scope,
                  projects: user.projects,
                  id: user._id.valueOf() + '',
                }
                console.log('buen log in')
                console.log(account)
                console.log(typeof account.id)
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
        password: require('bcrypt-nodejs').hashSync(request.payload.password),
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
    },
    update: function update (request, reply) {
      var db = request.mongo.db
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
        console.log(credentials)
        console.log(typeof request.payload)
        var updatedUser = qs.parse(request.payload)
        if (request.payload.password)
          request.payload.password = require('bcrypt-nodejs').hashSync(request.payload.password)
        // reply('gooot')
        UserManager.update(request.mongo.db, {'username': credentials.username}, {$set: updatedUser}, function (res) {
          reply(res)
        })
      } else {
        reply('not Authenticated')
      }
    },
    // COLLABORATION
    addCollaboration: function addCollaboration (request, reply) {
      console.log(request.payload)
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
        console.log(credentials)
        var newCollaboration = {}
        newCollaboration[request.payload.offerOrNeed] = {
          title: request.payload.title,
          type: request.payload.type
        }
        console.log(newCollaboration)
        UserManager.update(request.mongo.db, {'username': credentials.username}, {$push: newCollaboration}, function (res) {
          reply(res)
        })
      } else {
        reply('not Authenticated')
      }
    },
    updateCollaboration: function updateCollaboration (request, reply) {
      console.log(request.payload)
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
        console.log(credentials)
        var query = {
          'username': credentials.username
        }
        query[request.payload.offerOrNeed + 's.title'] = request.payload.oldTitle
        var updatedCollaboration = {}
        updatedCollaboration[request.payload.offerOrNeed + 's.$.type'] = request.payload.newType
        updatedCollaboration[request.payload.offerOrNeed + 's.$.title'] = request.payload.newTitle
        console.log(query)
        console.log(updatedCollaboration)
        UserManager.update(
          request.mongo.db,
          query,
          {$set: updatedCollaboration},
          function (res) {
            reply(res)
          })
      } else {
        reply('not Authenticated')
      }
    },
    removeCollaboration: function removeCollaboration (request, reply) {
      console.log(request.payload)
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
        console.log(credentials)
        var collaborationToRemove = {}
        collaborationToRemove[request.payload.offerOrNeed + 's'] = {'title': request.payload.title}
        UserManager.update(request.mongo.db, {'username': credentials.username}, {$pull: collaborationToRemove}, function (res) {
          reply(res)
        })
      } else {
        reply('not Authenticated')
      }
    },
    // INTERESTS
    addInterest: function addInterest (request, reply) {
      console.log(request.payload)
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
        console.log(credentials)
        UserManager.update(request.mongo.db, {'username': credentials.username}, {$push: request.payload}, function (res) {
          reply(res)
        })
      } else {
        reply('not Authenticated')
      }
    },
    removeInterest: function removeInterest (request, reply) {
      console.log(request.payload)
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
        console.log(credentials)
        UserManager.update(request.mongo.db, {'username': credentials.username}, {$pull: request.payload}, function (res) {
          reply(res)
        })
      } else {
        reply('not Authenticated')
      }
    },
    // CATEGORIES
    addCategory: function addCategory (request, reply) {
      console.log(request.payload)
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
        console.log(credentials)
        UserManager.update(request.mongo.db, {'username': credentials.username}, {$push: request.payload}, function (res) {
          reply(res)
        })
      } else {
        reply('not Authenticated')
      }
    },
    removeCategory: function removeCategory (request, reply) {
      console.log(request.payload)
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
        console.log(credentials)
        UserManager.update(request.mongo.db, {'username': credentials.username}, {$pull: request.payload}, function (res) {
          reply(res)
        })
      } else {
        reply('not Authenticated')
      }
    },
    // SKILLS
    addSkill: function addSkill (request, reply) {
      console.log(request.payload)
      var wantToArray = []
      if (request.payload['wantTo[]']) {
        if (typeof request.payload['wantTo[]'] == 'string') {
          wantToArray[0] = request.payload['wantTo[]']
        } else {
          wantToArray = request.payload['wantTo[]']
        }
      }
      var newSkill = {
        skill: request.payload.skill,
        wantTo: wantToArray
      }
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
        console.log(credentials)
        UserManager.update(request.mongo.db, {'username': credentials.username}, {$push: {skills: newSkill}}, function (res) {
          reply(res)
        })
      } else {
        reply('not Authenticated')
      }
    },
    removeSkill: function removeSkill (request, reply) {
      console.log(request.payload)
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
        console.log(credentials)
        UserManager.update(request.mongo.db, {'username': credentials.username}, {$pull: {'skills': request.payload}}, function (res) {
          reply(res)
        })
      } else {
        reply('not Authenticated')
      }
    }
  }
})()
var UserController = new UserController()
module.exports = UserController
