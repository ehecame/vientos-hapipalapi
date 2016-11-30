var ProjectManager = require('./../managers/project')
var LabelManager = require('./../managers/label')
var SessionController = require('./../controllers/session')

module.exports = function () {
  return [
    {
      method: 'GET',
      path: '/prueba/{lang?}',
      config: {
        handler: function (request, reply) {
          var lang = request.params.lang ? request.params.lang : 'es'
          console.log('language:' + lang)
          var db = request.mongo.db
          var objID = request.mongo.ObjectID
          LabelManager.findByLanguage(db, lang, function (res) {
            var data = res[0]
            reply.view('prueba', data, { layout: 'prueba'})
          })
        }
      }
    },
    {
      method: 'GET',
      path: '/project/{projectNick}/event/{eventId}',
      config: {
        handler: function (request, reply) {
          reply.view('calendar', {}, {layout:'empty'} )
       },
       auth: false
      }
   },{
      method: 'GET',
      path: '/demo/collaborateResp',
      config: {
        handler: function (request, reply) {
          data = {}
          reply.view('collaborateDemo', data,{ layout: 'empty' })
       },
       auth: false
      }
   }, {
     method: 'GET',
     path: '/demo/collaborate',
     config: {
      handler: function (request, reply) {
         setDataAuth(request, function(data){
           reply.view('demoCol', data, { layout: 'empty' });
         })
      },
      auth: false
     }
   }, {
     method: 'GET',
     path: '/demo/sidebar',
     config: {
      handler: function (request, reply) {
         setDataAuth(request, function(data){
           reply.view('demoSide', data, { layout: 'empty' });
         })
      },
      auth: false
     }
   }, {
     method: 'GET',
     path: '/project/{nick}/events',
     config: {
      handler: function (request, reply) {
         setDataAuth(request, function(data){
           reply.view('demoCalendar', data, { layout: 'empty' });
         })
      },
      auth: false
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
