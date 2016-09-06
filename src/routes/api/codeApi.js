var CodeController = require('./../../controllers/api/code.js')

module.exports = function () {
  return [
    {
      method: 'POST',
      path: '/api/code',
      config: {
        handler: CodeController.insert,
        auth: {
          scope: 'admin'
        }
      }
    }, {
      method: 'DELETE',
      path: '/api/code',
      config: {
        handler: CodeController.delete
      }
    },
    {
      method: 'GET',
      path: '/api/code/goodcode',
      config: {
        handler: CodeController.goodCode,
        auth: false
      }
    }
  ]
}()
