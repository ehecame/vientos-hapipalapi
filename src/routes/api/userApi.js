var UserController = require('./../../controllers/api/user.js')

module.exports = function () {
  return [
    {
      method: 'POST',
      path: '/api/user/login',
      config: {
        handler: UserController.login,
        auth: {
          strategy: 'standard',
          mode: 'try'
        },
        plugins: { 'hapi-auth-cookie': {redirectTo: false}}
      }
    },
    {
      method: 'POST',
      path: '/api/user/register',
      config: {
        handler: UserController.register,
        auth: false
      }
    },
    {
      method: 'DELETE',
      path: '/api/user/logout',
      config: {
        handler: UserController.logout
      }
    },
    // INTERESTS
    {
      method: 'POST',
      path: '/api/user/interests',
      config: {
        handler: UserController.addInterest
      }
    }, {
      method: 'DELETE',
      path: '/api/user/interests',
      config: {
        handler: UserController.removeInterest
      }
    },
    // CATEHGORIES
    {
      method: 'POST',
      path: '/api/user/categories',
      config: {
        handler: UserController.addCategory
      }
    }, {
      method: 'DELETE',
      path: '/api/user/categories',
      config: {
        handler: UserController.removeCategory
      }
    },
    // SKILLS
    {
      method: 'POST',
      path: '/api/user/skills',
      config: {
        handler: UserController.addSkill
      }
    }, {
      method: 'DELETE',
      path: '/api/user/skills',
      config: {
        handler: UserController.removeSkill
      }
    }
  ]
}()
