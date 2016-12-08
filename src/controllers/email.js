var UserManager = require('./../managers/user')
var nodemailer = require('nodemailer')
var credentials = require('./credentials.json')

function SessionController () { }
SessionController.prototype = (function () {
  return {
    sendMail: function (from, to, subject, tex ) {
      return request.auth.isAuthenticated
    },
  }
})()
var SessionController = new SessionController()
module.exports =
