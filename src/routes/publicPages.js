var CategoryManager = require('./../managers/category')
var ProjectManager = require('./../managers/project')
var SessionController = require('./../controllers/session')
var Bcrypt = require('bcrypt-nodejs')
var multiparty = require('multiparty')
var fs = require('fs')

module.exports = function () {
  return [
    {
      method: 'GET',
      path: '/',
      config: {
        handler: function (request  , reply) {
          var data = {
            isAuthenticated: SessionController.isAuthenticated(request),
            withFooter: true
          }
          if (data.isAuthenticated) {
            data.credentials = SessionController.getSession(request)
          }
          console.log(require('bcrypt-nodejs').hashSync('juanelas'))
          reply.view('index', data)
        }
      // auth: {
      //   mode: 'try',
      //   strategy: 'standard'
      // },
      // plugins: { 'hapi-auth-cookie': { redirectTo: false } }
      }
    }, {
      method: 'GET',
      path: '/search',
      handler: function (request, reply) {
        var db = request.mongo.db
        CategoryManager.findAll(db, function (res) {
          var data = {
            categories: res
          }
          console.log(data)
          reply.view('search', data)
        })
      }
    }, {
      method: 'GET',
      path: '/about',
      handler: function (request, reply) {
        reply.view('about')
      }
    }, {
      method: 'GET',
      path: '/collaborate',
      config: {
        handler: function (request, reply) {
          var data = {
            isAuthenticated: SessionController.isAuthenticated(request)
          }
          if (data.isAuthenticated) {
            data.credentials = SessionController.getSession(request)
          }
          reply.view('collaborate', data)
        }
      // auth: false
      }
    }, {
      method: 'GET',
      path: '/list',
      config: {
        handler: function (request, reply) {
          var data = {
            isAuthenticated: SessionController.isAuthenticated(request)
          }
          if (data.isAuthenticated) {
            data.credentials = SessionController.getSession(request)
          }
          reply.view('list', data)
        }
      // auth: false
      }
    }, {
      method: 'GET',

      path: '/howtocollaborate',
      handler: function (request, reply) {
        reply.view('howToCollaborate')
      }
    }, {
      method: 'GET',
      path: '/login',
      config: {
        handler: function (request, reply) {
          var data = {}
          console.log('redirectTo:')
          console.log(request.query)
          data.redirect = request.query.next ? request.query.next : '/myprofile'
          // if (request.auth.credentials) {
          //   console.log('credentials: ' + request.auth.credentials)
          //   data = {
          //     id: request.auth.credentials.id,
          //     name: request.auth.credentials.name
          //   }
          // }

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
          var db = request.mongo.db
          var objID = request.mongo.ObjectID
          ProjectManager.findById(db, new objID(request.params.projectId), function (res) {
            var data = res[0]
            var credentials = SessionController.getSession(request)
            data.isAuthenticated = SessionController.isAuthenticated(request)
            data.withFooter = true
            if (data.isAuthenticated) {
              data.credentials = SessionController.getSession(request)
              var isAdmin = data.credentials.scope && (data.credentials.scope == 'admin' || data.credentials.scope.indexOf('admin')>0)
              data.isOwner = isAdmin || 
                            ( data.ownsers && data.owners.indexOf(credentials.id) > -1 
                              && credentials.projects && credentials.projects.indexOf(request.params.projectId) > -1)
            }
            reply.view('projectProfile', data)
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
        },
        auth: {
          strategy: 'standard'
        }
      }
    }
  ]
}()
