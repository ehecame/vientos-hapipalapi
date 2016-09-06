var CategoryManager = require('./../managers/category')
var ProjectManager = require('./../managers/project')
var CodeManager = require('./../managers/code')
var SessionController = require('./../controllers/session')
var Bcrypt = require('bcrypt-nodejs')
var multiparty = require('multiparty')
var fs = require('fs')
var _ = require('underscore')

module.exports = function () {
  return [
    {
      method: 'GET',
      path: '/',
      config: {
        handler: function (request  , reply) {
          setDataAuth(request, function(data){
            data.withFooter = true
            reply.view('index', data)
          })
        }
      // auth: {
      //   mode: 'try',
      //   strategy: 'standard'
      // },
      // plugins: { 'hapi-auth-cookie': { redirectTo: false } }
      }
    }, {
      method: 'GET',
      path: '/about',
      handler: function (request, reply) {
        setDataAuth(request, function(data){
          data.withFooter = true
          reply.view('about', data)
        })
      }
    }, {
      method: 'GET',
      path: '/collaborate',
      config: {
        handler: function (request, reply) {
          setDataAuth(request, function(data){
            data.withFooter = false
            reply.view('collaborate', data)
          })
        }
      // auth: false
      }
    }, {
      method: 'GET',
      path: '/userregister/{code?}',
      config: {
        handler: function (request, reply) {
          setDataAuth(request, function(data){
            data.withFooter = false
            data.code = request.params.code
            reply.view('userRegister', data)
          })
        },
        auth: false
      }
    } , {
      method: 'GET',

      path: '/howtocollaborate',
      handler: function (request, reply) {
        setDataAuth(request, function(data){
          data.withFooter = true
          reply.view('howToCollaborate', data)
        })
      }
    }, {
      method: 'GET',
      path: '/login',
      config: {
        handler: function (request, reply) {
          var data = {}
          data.redirect = request.query.next ? request.query.next : '/myprofile'
          reply.view('login', data)
        },
        auth: false
      }
    }, {
      method: 'GET',
      path: '/logout',
      config: {
        handler: function (request, reply) {
          if (request.auth.isAuthenticated) {
            request.cookieAuth.clear()
          }
          reply.redirect('/')
        }
      }
    }, {
      method: 'GET',
      path: '/project/{projectId}',
      config: {
        handler: function (request, reply) {
          setDataAuth(request, function(data){
            data.withFooter = false
            var db = request.mongo.db
            var objID = request.mongo.ObjectID
            ProjectManager.findById(db, new objID(request.params.projectId), {}, function (res) {
              data.p = res
              data.isOwner = data.isAdmin || 
                            ( 
                              data.owners && 
                              data.owners.indexOf(data.credentials.id) > -1 && 
                              credentials.projects && 
                              credentials.projects.indexOf(request.params.projectId) > -1
                            )    
              if(!data.isAdmin)
                delete data.p.projectCodes
              data.p.categoriesIds = _.map(res.categories, function(cat){return cat.catId})
              console.log(data.p)
              reply.view('projectProfile', data)
            })
          })          
        } /*,
        auth: false*/
      }
    },{
      method: 'POST',
      path: '/uploadPicture',
      config: {
        payload: {
          maxBytes: 209715200,
          output: 'stream',
          parse: false
        },
        handler: function (requset, reply) {
          console.log('subiendo Foto')
          var form = new multiparty.Form()
          form.parse(requset.payload, function (err, fields, files) {
            if (err) return reply(err)
            else {
              fs.readFile(files.file[0].path, function(err, data) {
                fs.writeFile('./public/img/' + files.file[0].originalFilename, data, function(err) {
                  if (err) return reply(err);
                   else return reply('File uploaded : ' + files.file[0].originalFilename)
                })
              })
            } 
          })
        }
      }
    }
  ]
}()

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
