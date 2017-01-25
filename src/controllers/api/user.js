var UserManager = require('./../../managers/user')
var CodeManager = require('./../../managers/code')
var ProjectManager = require('./../../managers/project')
var SessionController = require('./../session')
var qs = require('qs')
var Bcrypt = require('bcrypt-nodejs')

function UserController () { }
UserController.prototype = (function () {
  return {
    login: function login (request, reply) {
      UserManager.find(
        request.mongo.db,
        {email: request.payload.email},
        {},
        function (res) {
          if (res.length > 0) {
            var user = res[0]
            var samePass = Bcrypt.compareSync(request.payload.password, user.password)
            if (samePass) {
              var account = {
                email: user.email,
                name: user.name,
                lastname: user.lastname,
                scope: user.scope,
                id: user._id.valueOf() + '',
              }
              if(user.projects){
                account.projects = user.projects
              }
              request.cookieAuth.set(account)
              reply(account)
            } else {
              reply('wrong password')
            }
          } else {
            reply('wrong username')
          }
        }
      )
    },
    register: function register (request, reply) {
      var db = request.mongo.db
      var objId = request.mongo.ObjectID
      var newuser = {
        email: request.payload.email,
        password: require('bcrypt-nodejs').hashSync(request.payload.password),
        name: request.payload.name
      }
      UserManager.insert(db, newuser, function (res) {
        newuser.id = res.insertedIds[0]
        newUser.password = null
        reply(newuser)
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
        var updatedUser = qs.parse(request.payload)
        if (request.payload.password)
          request.payload.password = require('bcrypt-nodejs').hashSync(request.payload.password)
        // reply('gooot')
        UserManager.update(db, {'username': credentials.username}, {$set: updatedUser}, function (res) {
          reply(res)
        })
      } else {
        reply('not Authenticated')
      }
    },
    existsUserName: function existsUserName (request, reply) {
      var db = request.mongo.db
      UserManager.findOne(db, {'username': request.query.username}, {_id:1}, function (res) {
        if(res)
          reply(true)
        else
          reply(false)
      })
    },
    existsEmail: function existsEmail (request, reply) {
      var db = request.mongo.db
      UserManager.findOne(db, {'email': request.query.email}, {_id:1}, function (res) {
        if(res)
          reply(true)
        else
          reply(false)
      })
    },
    // COLLABORATION
    addCollaboration: function addCollaboration (request, reply) {
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
        var newCollaboration = {}
        newCollaboration[request.payload.offerOrNeed] = {
          title: request.payload.title,
          type: request.payload.type
        }
        UserManager.update(request.mongo.db, {'username': credentials.username}, {$push: newCollaboration}, function (res) {
          reply(res)
        })
      } else {
        reply('not Authenticated')
      }
    },
    updateCollaboration: function updateCollaboration (request, reply) {
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
        var query = {
          'username': credentials.username
        }
        query[request.payload.offerOrNeed + 's.title'] = request.payload.oldTitle
        var updatedCollaboration = {}
        updatedCollaboration[request.payload.offerOrNeed + 's.$.type'] = request.payload.newType
        updatedCollaboration[request.payload.offerOrNeed + 's.$.title'] = request.payload.newTitle
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
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
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
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
        UserManager.update(request.mongo.db, {'username': credentials.username}, {$push: request.payload}, function (res) {
          reply(res)
        })
      } else {
        reply('not Authenticated')
      }
    },
    removeInterest: function removeInterest (request, reply) {
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
        UserManager.update(request.mongo.db, {'username': credentials.username}, {$pull: request.payload}, function (res) {
          reply(res)
        })
      } else {
        reply('not Authenticated')
      }
    },
    // CATEGORIES
    addCategory: function addCategory (request, reply) {
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
        UserManager.update(request.mongo.db, {'username': credentials.username}, {$push: request.payload}, function (res) {
          reply(res)
        })
      } else {
        reply('not Authenticated')
      }
    },
    removeCategory: function removeCategory (request, reply) {
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
        UserManager.update(request.mongo.db, {'username': credentials.username}, {$pull: request.payload}, function (res) {
          reply(res)
        })
      } else {
        reply('not Authenticated')
      }
    },
    // SKILLS
    addSkill: function addSkill (request, reply) {
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
        UserManager.update(request.mongo.db, {'username': credentials.username}, {$push: {skills: newSkill}}, function (res) {
          reply(res)
        })
      } else {
        reply('not Authenticated')
      }
    },
    removeSkill: function removeSkill (request, reply) {
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
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
