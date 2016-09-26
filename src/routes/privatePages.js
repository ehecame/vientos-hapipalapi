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
          setDataAuth(request, function(data){
            data.withFooter = false
            data.tags = {
              closeToMe: 'Cerca de mí',
              collaborate: 'Colabora',
              login: 'Inicia sesión',
              logout: 'Cierra sesión',
              myProfile: "Mi Perfil"
            }
            if(data.isAuthenticated){
              console.log(data)
              var db = request.mongo.db
              var query = {username: data.credentials.username}
              var fields = {}
              UserManager.find(db, query, fields, function (res) {
                data.u = res[0]
                reply.view('userProfile', data)
              })
            } else {
              reply.redirect('/login?next=%2Fmyprofile')
            }
          })
        }
      }
    }, {
      method: 'GET',
      path: '/project/register',
      config: {
        handler: function (request, reply) {
          setDataAuth(request, function(data){
            reply.view('projectRegister', data)
          })
        },
        auth: {
          scope: 'admin'
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
    var isAdmin = data.credentials.scope &&
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
