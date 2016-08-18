var ProjectController = require('./../../controllers/api/project.js')

module.exports = function () {
  return [
    {
      method: 'GET',
      path: '/api/projects',
      config: {
        handler: ProjectController.findAll
      }
    },
    {
      method: 'GET',
      path: '/api/project/{project_id}',
      config: {
        handler: ProjectController.findById
      }
    },
    {
      method: 'GET',
      path: '/api/project/category/{category_id}',
      config: {
        handler: ProjectController.findByCategoryId
      }
    },
    {
      method: 'GET',
      path: '/api/project/keywords/{keywords}',
      config: {
        handler: ProjectController.findByKeyWords
      }
    },
    {
      method: 'POST',
      path: '/api/project',
      config: {
        handler: ProjectController.register
      }
    },
    {
      method: 'POST',
      path: '/api/project/shortregister',
      config: {
        handler: ProjectController.shortRegister
      }
    },
    {
      method: 'PUT',
      path: '/api/project/{id}',
      config: {
        handler: ProjectController.update
      }
    },
    {
      method: 'DELETE',
      path: '/api/project/{id}',
      config: {
        handler: ProjectController.delete
      }
    },
    // COLLABORATIONS
    {
      method: 'POST',
      path: '/api/project/collaboration',
      config: {
        handler: ProjectController.addCollaboration
      }
    },
    {
      method: 'PUT',
      path: '/api/project/collaboration',
      config: {
        handler: ProjectController.updateCollaboration
      }
    }, {
      method: 'DELETE',
      path: '/api/project/collaboration',
      config: {
        handler: ProjectController.removeCollaboration
      }
    }
  ]
}()
