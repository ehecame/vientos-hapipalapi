var ProjectManager = require('./../managers/project')
var _ = require('underscore')

function SessionController () { }
SessionController.prototype = (function () {
  return {
    isAuthenticated: function (request) {
      return request.auth.isAuthenticated
    },
    getSession: function (request) {
      return request.auth.credentials
    },
    getProjects: function(request, callback){
    	var db = request.mongo.db
    	var objId = request.mongo.ObjectID
    	if(!request.auth.credentials.projects) {
    		console.log('notProjects')
    		return null
    	} else {
    		console.log('withProjects')
	    	var projectIds = _.map(request.auth.credentials.projects, function(p){return new objId(p)})
	    	ProjectManager.find(db, {_id:{ $in: projectIds}},{_id:1,name:1}, callback)
	    }
    }
  }
})()
var SessionController = new SessionController()
module.exports = SessionController
