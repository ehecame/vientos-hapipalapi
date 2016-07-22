var fs = require('fs')
var multiparty = require('multiparty')
var SessionController = require('./../controllers/session')
var UserManager = require('./../managers/user')

module.exports = function () {
  return [
    {
      method: 'GET',
      path: '/myprofile',
      config: {
        handler: function (request, reply) {
          var isAuthenticated = SessionController.isAuthenticated(request)
          if (isAuthenticated) {
            var credentials = SessionController.getSession(request)
            console.log(credentials)
            var db = request.mongo.db
            var query = {username: credentials.username}
            var fields = {}
            UserManager.find(db, query, fields, function (res) {
              var data = res[0]
              console.log(data)
              data.isAuthenticated = isAuthenticated
              data.withOutFooter = true
              data.credentials = credentials              
              reply.view('userProfile', data)
            })
          }else{
            reply.redirect('/login?next=%2Fmyprofile')
          }
        },
        auth: {
          strategy: 'standard'
        }
      }
    },
    {
      method: 'GET',
      path: '/myprojects/pilot',
      config: {
        handler: function (request, reply) {
          var data = {
            isAuthenticated: SessionController.isAuthenticated(request)
          }
          if (data.isAuthenticated) {
            data.credentials = SessionController.getSession(request)
          }
          reply.view('projectProfile', data)
        },
        auth: {
          strategy: 'standard'
        }
      }
    },
    {
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
