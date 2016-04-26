var Lab = require('lab') // load Lab module
var lab = exports.lab = Lab.script() // export test script
var Code = require('code') // assertion library
var server = require('../server.js') // our index.js from above

lab.experiment('Basic HTTP Tests', function () {
  // tests
  lab.test('GET / (should redirect to login)', function (done) {
    var options = {
      method: 'GET',
      url: '/'
    }
    // server.inject lets you similate an http request
    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(302) //  Expect http response status code to be 200 ("Ok")
      server.stop(done) // done() callback is required to end the test.
    })
  })
})
