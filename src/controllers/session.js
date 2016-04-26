function SessionController () { }
SessionController.prototype = (function () {
  return {
    isAuthenticated: function (request) {
      return request.auth.isAuthenticated
    },
    getSession: function (request) {
      return request.auth.credentials
    }
  }
})()
var SessionController = new SessionController()
module.exports = SessionController
