var _ = require('underscore')
var ProjectManager = require('./../../managers/project')
var SessionController = require('./../session')
var CodeManager = require('./../../managers/code')
var qs = require('qs')

function ProjectController () { }
ProjectController.prototype = (function () {
  return {
    findAll: function findAll (request, reply) {
      var db = request.mongo.db
      ProjectManager.findAll(db, function (res) {
        setDataAuth(request, function(data){
          if(data.isAdmin){
            reply(_.map(res, function(p){p.isAdmin = true; return p}))
          }
          else {
            var filtPro = hideFieldsForNotPilot(res)
            reply(filtPro)
          }
        })
      })
    },
    findById: function findById (request, reply) {
      var db = request.mongo.db
      var objID = request.mongo.ObjectID
      ProjectManager.findById(db, new objID(request.params.project_id), {}, function (res) {
        setDataAuth(request, function(data){
          if(data.isAdmin)
            reply(_.map(res, function(p){p.isAdmin = true; return p}))
          else {
            var filtPro = hideFieldsForNotPilot(res)
            reply(filtPro)
          }
        })
      })
    },
    findByCategoryId: function findByCategoryId (request, reply) {
      var db = request.mongo.db
      ProjectManager.findByCategoryId(db, request.params.category_id, function (res) {
        setDataAuth(request, function(data){
          if(data.isAdmin)
            reply(_.map(res, function(p){p.isAdmin = true; return p}))
          else {
            var filtPro = hideFieldsForNotPilot(res)
            reply(filtPro)
          }
        })
      })
    },
    findByTypeId: function findByTypeId (request, reply) {
      var db = request.mongo.db
      ProjectManager.findByTypeId(db, request.params.type_id, function (res) {
        setDataAuth(request, function(data){
          if(data.isAdmin)
            reply(_.map(res, function(p){p.isAdmin = true; return p}))
          else {
            var filtPro = hideFieldsForNotPilot(res)
            reply(filtPro)
          }
        })
      })
    },
    findByCollaborationWay: function findByCollaborationWay (request, reply) {
      var db = request.mongo.db
      ProjectManager.findByCollaborationWay(db, request.params.collaboration_type_id, function (res) {
        setDataAuth(request, function(data){
          if(data.isAdmin)
            reply(_.map(res, function(p){p.isAdmin = true; return p}))
          else {
            var filtPro = hideFieldsForNotPilot(res)
            reply(filtPro)
          }
        })
      })
    },
    findByKeyWords: function findByKeyWords (request, reply) {
      var db = request.mongo.db
      ProjectManager.findByKeyWords(db, request.params.keywords, function (res) {
        setDataAuth(request, function(data){
          if(data.isAdmin)
            reply(_.map(res, function(p){p.isAdmin = true; return p}))
          else {
            var filtPro = hideFieldsForNotPilot(res)
            reply(filtPro)
          }
        })
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
      var logo
      var parsedProject = qs.parse(request.payload)
      if (request.payload.file) {
        var fullPath = request.payload.file
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'))
        logo = fullPath.substring(startIndex)
        if (logo.indexOf('\\') === 0 || logo.indexOf('/') === 0) {
          logo = logo.substring(1)
        }
      }
      var newProject = {
        email: parsedProject.email,
        name: parsedProject.name,
        description: parsedProject.description,
        categories: _.map(parsedProject.categories, function(cat){return getCategoryObj(cat)}),
        address: parsedProject.address,
        latitude: parsedProject.latitude,
        longitude: parsedProject.longitude,
        projectType: getProjectTypeObj(parsedProject.projectType),
        webpage: parsedProject.webpage,
        facebook: parsedProject.facebook,
        logo: logo,
        schedule: parsedProject.schedule,
      }
      if(parsedProject.latitude && parsedProject.longitude){
        parsedProject.locations= [{
          lat: parsedProject.latitude,
          lon: parsedProject.longitude
        }]
      }
      // reply('gooot')
      ProjectManager.insert(db, newProject, function (res) {
        reply(res)
      })
    },
    update: function update (request, reply) {
      var db = request.mongo.db
      var objID = request.mongo.ObjectID
      var query = {'_id': new objID(request.params.id)}
      var parsedProject = qs.parse(request.payload)
      var updatedProject = {
        email: parsedProject.email,
        name: parsedProject.name,
        description: parsedProject.description,
        categories: _.map(parsedProject.categories, function(cat){return getCategoryObj(cat)}),
        address: parsedProject.address,
        latitude: parsedProject.latitude,
        longitude: parsedProject.longitude,
        projectType: getProjectTypeObj(parsedProject.projectType),
        webpage: parsedProject.webpage,
        facebook: parsedProject.facebook,
        schedule: parsedProject.schedule,
      }
      if(parsedProject.latitude && parsedProject.longitude){
        updatedProject.locations= [{
          lat: parsedProject.latitude,
          lon: parsedProject.longitude
        }]
      }
      setDataAuth(request, function(data){
        ProjectManager.findById(db, new objID(request.params.id),{} , function (res) {
          data.p = res
          data.isOwner = isOwner(data,request.params.id)
          if(data.isOwner){
            ProjectManager.update(db, query, {$set: updatedProject}, function (res2) {
               reply('updated')
            })
          }
          else reply('notAuthorized')
        })
      })
    },
    updateLogo: function updateLogo(request, reply){
      var db = request.mongo.db
      var objID = request.mongo.ObjectID
      var projectId = request.params.id
      setDataAuth(request, function(data){
        ProjectManager.findById(db, new objID(projectId),{} , function (res) {
          data.p = res
          data.isOwner = isOwner(data,projectId)
          if(data.isOwner){
            ProjectManager.update(db, {_id: new objID(projectId)}, {$set: {logo: request.payload.logo}}, function (res2) {
               reply('newLogo')
            })
          }
          else reply('notAuthorized')
        })
      })
    },
    delete: function (request, reply) {
      var db = request.mongo.db
      var objID = request.mongo.ObjectID
      ProjectManager.delete(db, {'_id': request.params.id}, function (res) {
        reply(res)
      })
    },
    // PROJECT CODE
    addCode: function addCode(request, reply) {
      var db = request.mongo.db
      var objID = request.mongo.ObjectID
      var credentials = request.auth.credentials
      if( credentials.scope && ( credentials.scope == 'admin' || credentials.scope.indexOf('admin')>0)){
        var code = Math.random().toString(36).slice(2)
        var updatedProject = {$push: {projectCodes: code}}
        var query = {'_id': new objID(request.payload.id)}
        ProjectManager.update(db, query, updatedProject, function (res) {
          CodeManager.insert(db, {code: code, projectLinked: request.payload.id}, function(res){
            reply(code)
          })
        })
      } else
        reply('notAuthorized')
    },
    // COLLABORATION
    addCollaboration: function addCollaboration (request, reply) {
      var objID = request.mongo.ObjectID
      var db = request.mongo.db
      var projectId = request.payload.projectId
      setDataAuth(request, function(data){
        if(data.isAuthenticated){
          ProjectManager.findById(db, new objID(projectId),{} , function (res) {
            data.p = res
            data.isOwner = isOwner(data, projectId)
            if(data.isOwner){
              var newCollaboration = {}
              newCollaboration[request.payload.offerOrNeed] = {
                title: request.payload.title,
                type: request.payload.type
              }
              ProjectManager.update(request.mongo.db, {'_id': new objID(request.payload.projectId) }, {$push: newCollaboration}, function (res2) {
                reply(res2)
              })
            } else {
              reply('not Authorized')
            }
          })
        } else {
          reply('not Authenticated')
        }
      })
    },
    updateCollaboration: function updateCollaboration (request, reply) {
      var db = request.mongo.db
      var objID = request.mongo.ObjectID
      var projectId = request.payload.projectId
      setDataAuth(request, function(data){
        if(data.isAuthenticated){
          ProjectManager.findById(db, new objID(projectId),{} , function (res) {
            data.p = res
            data.isOwner = isOwner(data, projectId)
            if(data.isOwner){
              var query = {
                '_id': new objID(projectId)
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
                }
              )
            } else {
              reply('not Authorized')
            }
          })
        } else {
          reply('not Authenticated')
        }
      })
    },
    removeCollaboration: function removeCollaboration (request, reply) {
      var db = request.mongo.db
      var objID = request.mongo.ObjectID
      var projectId = request.payload.projectId
      setDataAuth(request, function(data){
        if(data.isAuthenticated){
          ProjectManager.findById(db, new objID(projectId),{} , function (res) {
            data.p = res
            data.isOwner = isOwner(data, projectId)
            if(data.isOwner){
              var query = {
                '_id': new objID(projectId)
              }
              var collaborationToRemove = {}
              collaborationToRemove[request.payload.offerOrNeed + 's'] = {'title': request.payload.title}
              ProjectManager.update(request.mongo.db, query, {$pull: collaborationToRemove}, function (res) {
                reply(res)
              })
            } else {
              reply('not Authorized')
            }
          })
        } else {
          reply('not Authenticated')
        }
      })
    }
  }
})()
var ProjectController = new ProjectController()
module.exports = ProjectController

function getProjectTypeObj(projectType){
  var projectObj
  if (projectType == 'cooperative') {
    projectObj = {
      type: projectType,
      label: 'Cooperativa',
      color: '#800000'
    }
  }
  if (projectType == 'collective') {
    projectObj = {
      type: projectType,
      label: 'Colectivo',
      color: '#008B8B'
    }
  }
  if (projectType == 'ngo') {
    projectObj = {
      type: projectType,
      label: 'ONG',
      color: '#556B2F'
    }
  }
  if (projectType == 'ethicalbusiness') {
    projectObj = {
      type: projectType,
      label: 'Economía solidaria',
      color: '#B8860B'
    }
  }
  if (projectType == 'neighborsorg') {
    projectObj = {
      type: projectType,
      label: 'Iniciativa Ciudadana',
      color: '#C63D1E'
    }
  }
  if (projectType == 'startup') {
    projectObj = {
      type: projectType,
      label: 'Startup',
      color: '#58376C'
    }
  }
  if (projectType == 'ontransition') {
    projectObj = {
      type: projectType,
      label: 'En Transición',
      color: '#d45bc9'
    }
  }
  return projectObj
}

function getCategoryObj(category){
  if(category == 'humanrights'){
    return {
      "catId" : "humanrights",
      "name" : {
          "es" : "Derechos Humanos"
      },
      "icon" : "fa-globe"
    }
  }
  if(category == 'productsservices'){
    return {
      "catId" : "productsservices",
      "name" : {
          "es" : "Productos y Servicios"
      },
      "icon" : "fa-shopping-basket"
    }
  }
  if(category == 'environment'){
    return {
      "catId" : "environment",
      "name" : {
          "es" : "Medio Ambiente"
      },
      "icon" : "fa-pagelines"
    }
  }
  if(category == 'artculture'){
    return {
      "catId" : "artculture",
      "name" : {
          "es" : "Arte y Cultura"
      },
      "icon" : "fa-paint-brush"
    }
  }
  if(category == 'gender'){
    return {
      "catId" : "gender",
      "name" : {
          "es" : "Género"
      },
      "icon" : "fa-transgender-alt"
    }
  }
  if(category == 'health'){
    return {
      "catId" : "health",
      "name" : {
          "es" : "Salud"
      },
      "icon" : "fa-medkit"
    }
  }
  if(category == 'education'){
    return {
      "catId" : "education",
      "name" : {
          "es" : "Educación"
      },
      "icon" : "fa-book"
    }
  }
  if(category == 'workshops'){
    return {
      "catId" : "workshops",
      "name" : {
          "es" : "Talleres"
      },
      "icon" : "fa-puzzle-piece"
    }
  }
  if(category == 'community'){
    return {
      "catId" : "community",
      "name" : {
          "es" : "Comunidad"
      },
      "icon" : "fa-users"
    }
  }
  if(category == 'food'){
    return {
      "catId" : "food",
      "name" : {
          "es" : "Comida"
      },
      "icon" : "fa-cutlery"
    }
  }
  if(category == 'housing'){
    return {
      "catId" : "housing",
      "name" : {
          "es" : "Vivienda"
      },
      "icon" : "fa-home"
    }
  }
  if(category == 'clothing'){
    return {
      "catId" : "clothing",
      "name" : {
          "es" : "Vestido"
      },
      "icon" : "fa-scissors"
    }
  }
  if(category == 'communication'){
    return {
      "catId" : "communication",
      "name" : {
          "es" : "Comunicación"
      },
      "icon" : "fa-bullhorn"
    }
  }
  if(category == 'technology'){
    return {
      "catId" : "technology",
      "name" : {
          "es" : "Tecnología"
      },
      "icon" : "fa-cogs"
    }
  }
  if(category == 'transport'){
    return {
      "catId" : "transport",
      "name" : {
          "es" : "Transporte"
      },
      "icon" : "fa-bicycle"
    }
  }
}

function setDataAuth(request, callback){
  var data = {
    isAuthenticated: SessionController.isAuthenticated(request),
  }
  if (data.isAuthenticated) {
    data.credentials = SessionController.getSession(request)
    data.isAdmin = data.credentials.scope &&
                  ( data.credentials.scope == 'admin' ||
                    data.credentials.scope.indexOf('admin')>0)
    if(data.credentials.projects){
      SessionController.getProjects(request, function(res){
        data.myProjects = res
        callback(data)
      })
    } else callback(data)
  } else callback(data)
}

function hideFieldsForNotPilot(res){
  return _.map(res, function(p){
          if(!p.pilot){
            p.name = 'No ha sido activado'
            delete p.description
            delete p.logo
            delete p.address
            delete p.facebook
            delete p.twitter
            delete p.webpage
            delete p.phone
            delete p.cellphone
            delete p.email
          }
          return p
        })
}

function isOwner(data, projectId){
  return data.isAdmin ||
    (
      data.p.owners &&
      data.p.owners.indexOf(data.credentials.id) > -1 &&
      data.credentials.projects &&
      data.credentials.projects.indexOf(projectId) > -1
    )
}
