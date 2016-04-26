var CategoryController = require('./../../controllers/api/category.js')

module.exports = function () {
  return [
    {
      method: 'GET',
      path: '/api/category',
      config: {
        handler: CategoryController.findAll
      }
    },
    {
      method: 'POST',
      path: '/api/category',
      config: {
        handler: CategoryController.insert
      }
    },
    {
      method: 'PUT',
      path: '/api/category/{id}',
      config: {
        handler: CategoryController.update
      }
    },
    {
      method: 'DELETE',
      path: '/api/category/{id}',
      config: {
        handler: CategoryController.delete
      }
    }
  ]
}()
