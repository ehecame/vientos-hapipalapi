var _ = require('underscore')
var ProjectManager = require('./../../managers/project')
var SessionController = require('./../session')
var CodeManager = require('./../../managers/code')
var qs = require('qs')

function ProjectController () { }
ProjectController.prototype = (function () {
  return {
    findAll: function findAll (request, reply) {
      console.log('FindAllProjects')
      var db = request.mongo.db
      ProjectManager.findAll(db, function (res) {
        console.log('projects: ' + res.length)
        reply(_.map(res, function(p){
          var filter = {}
          if(p.pilot){
            filter = ṕ
          }else{
            filter.name = 'No ha sido activado'
            filter.description = p.description
            filter.location = p.location
            filter.projectType = p.projectType
            filter.categories = p.categories
          }
          return filter
        }))
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
      ProjectManager.findById(db, new objID(request.params.project_id), {}, function (res) {
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
    findByTypeId: function findByTypeId (request, reply) {
      var db = request.mongo.db
      ProjectManager.findByTypeId(db, request.params.type_id, function (res) {
        console.log(res)
        reply(res)
      })
    },
    findByCollaborationWay: function findByCollaborationWay (request, reply) {
      var db = request.mongo.db
      ProjectManager.findByCollaborationWay(db, request.params.collaboration_type_id, function (res) {
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
      var logo
      console.log(request.payload)
      var parsedProject = qs.parse(request.payload)
      console.log(parsedProject)
      if (request.payload.file) {
        var fullPath = request.payload.file
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'))
        logo = fullPath.substring(startIndex)
        if (logo.indexOf('\\') === 0 || logo.indexOf('/') === 0) {
          logo = logo.substring(1)
        }
        console.log(logo)
      }
      var newProject = {
        email: parsedProject.email,
        name: parsedProject.name,
        description: parsedProject.description,
        categories: _.map(parsedProject.categories, function(cat){return getCategoryObj(cat)}),
        address: parsedProject.address,
        latitude: parsedProject.latitude,
        longitude: parsedProject.longitude,
        location: [{
          lat: parsedProject.latitude,
          lon: parsedProject.longitude
        }],
        projectType: getProjectTypeObj(parsedProject.projectType),
        webpage: parsedProject.webpage,
        facebook: parsedProject.facebook,
        logo: logo,
        schedule: parsedProject.schedule,
      }
      console.log(newProject)
      // reply('gooot')
      ProjectManager.insert(db, newProject, function (res) {
        reply(res)
      })
    },
    update: function update (request, reply) {
      var db = request.mongo.db
      var objID = request.mongo.ObjectID
      console.log(request.payload)
      var query = {'_id': new objID(request.params.id)}
      var parsedProject = qs.parse(request.payload)
      var updatedProject = {$set: {
        email: parsedProject.email,
        name: parsedProject.name,
        description: parsedProject.description,
        categories: _.map(parsedProject.categories, function(cat){return getCategoryObj(cat)}),
        address: parsedProject.address,
        latitude: parsedProject.latitude,
        longitude: parsedProject.longitude,
        location: [{
          lat: parsedProject.latitude,
          lon: parsedProject.longitude
        }],
        projectType: getProjectTypeObj(parsedProject.projectType),
        webpage: parsedProject.webpage,
        facebook: parsedProject.facebook,
        schedule: parsedProject.schedule,
      }}
      setDataAuth(request, function(data){
        console.log(data)
        ProjectManager.findById(db, query,{}, function (res) {
          data.p = res
          console.log(res)
          data.isOwner = data.isAdmin || 
                        ( 
                          data.owners && 
                          data.owners.indexOf(credentials.id) > -1 && 
                          credentials.projects && 
                          credentials.projects.indexOf(request.params.projectId) > -1
                        )    
          if(data.isOwner){
            ProjectManager.update(db, query, updatedProject, function (res2) {
               console.log(res2)
               reply('uṕdated')
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
      var isAuthenticated = SessionController.isAuthenticated(request)
      if (isAuthenticated) {
        var credentials = SessionController.getSession(request)
        ProjectManager.findById(db, new objID(request.payload.projectId), {owners: 1}, function (res) {
          if (credentials.scope == 'admin' || (res.owners && res.owners.indexOf(credentials.id) > -1 &&
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
        ProjectManager.findById(db, new objID(request.payload.projectId), {owners:1}, function (res) {
          if (credentials.scope == 'admin' || (res.owners && res.owners.indexOf(credentials.id) > -1 &&
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

function getProjectTypeObj(projectType){
  if (projectType == 'collective') {
    return {
      type: projectType,
      label: 'Cooperativa',
      color: '#800000'
    }
  }
  if (projectType == 'cooperative') {
    return {
      type: projectType,
      label: 'Colectivo',
      color: '#008B8B'
    }
  }
  if (projectType == 'ngo') {
    return {
      type: projectType,
      label: 'ONG',
      color: '#556B2F'
    }
  }
  if (projectType == 'ethicalbusiness') {
    return {
      type: projectType,
      label: 'Negocio Ético',
      color: '#B8860B'
    }
  }
  if (projectType == 'neighborsorg') {
    return {
      type: projectType,
      label: 'Iniciativa Ciudadana',
      color: '#C63D1E'
    }
  }
  if (projectType == 'startup') {
    return {
      type: projectType,
      label: 'Startup',
      color: '#58376C'
    }
  }
  if (projectType == 'ontransition') {
    return {
      type: projectType,
      label: 'En Transición',
      color: '#d45bc9'
    }
  }
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
      "icon" : "fa-shopping"
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