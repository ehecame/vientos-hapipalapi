var _ = require('underscore')
var ProjectManager = require('./../../managers/project')
var SessionController = require('./../session')

function ProjectController () { }
ProjectController.prototype = (function () {
  return {
    findAll: function findAll (request, reply) {
      console.log('FindAllProjects')
      var db = request.mongo.db
      ProjectManager.findAll(db, function (res) {
        console.log('projects: ' + res.length)
        reply(res)
      })
    },
    findAutogestival: function findAutogestival (request, reply) {
      var db = request.mongo.db
      ProjectManager.findAutogestival(db, function (res) {
        reply(res)
      })
    },
    findById: function findById (request, reply) {
      var db = request.mongo.db
      var objID = request.mongo.ObjectID
      ProjectManager.findById(db, new objID(request.params.project_id), function (res) {
        reply(res)
      })
    },
    findByCategoryId: function findByCategoryId (request, reply) {
      var db = request.mongo.db
      ProjectManager.findByCategoryId(db, request.params.category_id, function (res) {
        console.log(res)
        reply(res)
      })
    },
    findByKeyWords: function findByKeyWords (request, reply) {
      var db = request.mongo.db
      ProjectManager.findByKeyWords(db, request.params.keywords, function (res) {
        reply(res)
      })
    },
    shortRegister: function shortRegister (request, reply) {
      var newProject = {
        email: request.payload.email,
        password: request.payload.password,
        name: request.payload.name
      }
      ProjectManager.insert(db, newProject, function (res) {
        reply(res)
      })
    },
    register: function register (request, reply) {
      var db = request.mongo.db
      var objID = request.mongo.ObjectID
      var categories_objids = []
      var scheduleArray = []
      var offersArray = []
      var needsArray = []
      var projectType = {}
      var logo
      console.log(request.payload)
      if (request.payload['categories[]']) {
        if (typeof request.payload['categories[]'] == 'string') {
          categories_objids[0] = new objID(request.payload['categories[]'])
        } else {
          for (var i = 0; i < request.payload['categories[]'].length; i++) {
            categories_objids[i] = (new objID(request.payload['categories[]'][i]))
          }
        }
      }
      if (request.payload['schedule[]']) {
        if (typeof request.payload['schedule[]'] == 'string') {
          scheduleArray[0] = request.payload['schedule[]']
        } else {
          scheduleArray = request.payload['schedule[]']
        }
      }
      if (request.payload['offers[]']) {
        if (typeof request.payload['offers[]'] == 'string') {
          offersArray[0] = request.payload['offers[]']
        } else {
          offersArray = request.payload['offers[]']
        }
      }
      if (request.payload['needs[]']) {
        if (typeof request.payload['needs[]'] == 'string') {
          needsArray[0] = request.payload['needs[]']
        } else {
          needsArray = request.payload['needs[]']
        }
      }
      if (request.payload.projectType == 'collective') {
        projectType = {
          type: request.payload.projectType,
          label: 'Cooperativa',
          color: '#800000'
        }
      }
      if (request.payload.projectType == 'cooperative') {
        projectType = {
          type: request.payload.projectType,
          label: 'Colectivo',
          color: '#008B8B'
        }
      }
      if (request.payload.projectType == 'ngo') {
        projectType = {
          type: request.payload.projectType,
          label: 'ONG',
          color: '#556B2F'
        }
      }
      if (request.payload.projectType == 'ethicalbusiness') {
        projectType = {
          type: request.payload.projectType,
          label: 'Negocio Ético',
          color: '#B8860B'
        }
      }
      if (request.payload.projectType == 'neighborsorg') {
        projectType = {
          type: request.payload.projectType,
          label: 'Iniciativa Ciudadana',
          color: '#C63D1E'
        }
      }
      if (request.payload.projectType == 'startup') {
        projectType = {
          type: request.payload.projectType,
          label: 'Startup',
          color: '#58376C'
        }
      }
      if (request.payload.projectType == 'ontransition') {
        projectType = {
          type: request.payload.projectType,
          label: 'En Transición',
          color: '#d45bc9'
        }
      }
      if (request.payload.file) {
        var fullPath = request.payload.file
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'))
        logo = fullPath.substring(startIndex)
        if (logo.indexOf('\\') === 0 || logo.indexOf('/') === 0) {
          logo = logo.substring(1)
        }
        console.log(logo)
      }
      console.log(projectType)
      var newProject = {
        email: request.payload.email,
        name: request.payload.name,
        description: request.payload.description,
        categories_ids: categories_objids,
        address: request.payload.address,
        latitude: request.payload.latitude,
        longitude: request.payload.longitude,
        location: {
          lat: request.payload.latitude,
          lon: request.payload.longitude
        },
        projectType: projectType,
        webpage: request.payload.webpage,
        facebook: request.payload.facebook,
        logo: logo,
        schedule: scheduleArray,
        offers: offersArray,
        needs: needsArray
      }
      console.log(newProject)
      // reply('gooot')
      ProjectManager.insert(db, newProject, function (res) {
        reply(res)
      })
    },
    update: function update (request, reply) {
      var db = request.mongo.db
      if (request.payload.parent) {
        console.log(request.payload.parent)
      } else {
        console.log('no parent')
      }
      ProjectManager.update(db, updatedProject, function (res) {
        reply(res)
      })
    },
    delete: function (request, reply) {
      var db = request.mongo.db
      ProjectManager.delete(db, request.params.id, function (res) {
        reply(res)
      })
    },
    // COLLABORATION
    addCollaboration: function addCollaboration (request, reply) {
      var objID = request.mongo.ObjectID
      var db = request.mongo.db
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
        ProjectManager.findById(db, new objID(request.payload.projectId), function (res) {
          if (credentials.scope == 'admin' || (res[0].owners && res[0].owners.indexOf(credentials.id) > -1 &&
            credentials.projects && credentials.projects.indexOf(request.payload.projectId) > -1)) {
            var newCollaboration = {}
            newCollaboration[request.payload.offerOrNeed] = {
              title: request.payload.title,
              type: request.payload.type
            }
            ProjectManager.update(request.mongo.db, {'_id': new objID(request.payload.projectId) }, {$push: newCollaboration}, function (res2) {
              console.log(res2)
              reply(res2)
            })
          } else {
            reply('notAuthorized')
          }
        })
      } else {
        reply('not Authenticated')
      }
    },
    updateCollaboration: function updateCollaboration (request, reply) {
      var db = request.mongo.db
      var objID = request.mongo.ObjectID
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
        ProjectManager.findById(db, new objID(request.payload.projectId), function (res) {
          if (credentials.scope == 'admin' || (res[0].owners && res[0].owners.indexOf(credentials.id) > -1 &&
            credentials.projects && credentials.projects.indexOf(request.payload.projectId) > -1)) {
            var query = {
              '_id': new objID(request.payload.projectId)
            }
            query[request.payload.offerOrNeed + 's.title'] = request.payload.oldTitle
            var updatedCollaboration = {}
            updatedCollaboration[request.payload.offerOrNeed + 's.$.type'] = request.payload.newType
            updatedCollaboration[request.payload.offerOrNeed + 's.$.title'] = request.payload.newTitle
            ProjectManager.update(
              request.mongo.db,
              query,
              {$set: updatedCollaboration},
              function (res) {
                reply(res)
              })
          } else {
            reply('notAuthorized')
          }
        })
      } else {
        reply('not Authenticated')
      }
    },
    removeCollaboration: function removeCollaboration (request, reply) {
      var objID = request.mongo.ObjectID
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
        if (credentials.scope == 'admin' || (res[0].owners && res[0].owners.indexOf(credentials.id) > -1 &&
          credentials.projects && credentials.projects.indexOf(request.payload.projectId) > -1)) {
          var query = {
            '_id': new objID(request.payload.projectId)
          }
          var collaborationToRemove = {}
          collaborationToRemove[request.payload.offerOrNeed + 's'] = {'title': request.payload.title}
          ProjectManager.update(request.mongo.db, query, {$pull: collaborationToRemove}, function (res) {
            reply(res)
          })
        } else {
          reply('notAuthorized')
        }
      } else {
        reply('not Authenticated')
      }
    }
  }
})()
var ProjectController = new ProjectController()
module.exports = ProjectController
