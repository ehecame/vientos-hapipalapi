module.exports = function () {
  return [
    {
      method: 'GET',
      path: '/js/{file}',
      config: {
        handler: function (request, reply) {
          console.log('js:' + request.params.file)
          reply.file('public/js/' + request.params.file + '.js')
        },
        auth: false
      }
    }, {
      method: 'GET',
      path: '/css/{file}',
      config: {
        handler: function (request, reply) {
          reply.file('public/css/' + request.params.file + '.css')
        },
        auth: false
      }
    }, {
      method: 'GET',
      path: '/img/{file}',
      config: {
        handler: function (request, reply) {
          reply.file('public/img/' + request.params.file)
        },
        auth: false
      }
    }, {
      method: 'GET',
      path: '/logo/{id}',
      config: {
        handler: function (request, reply) {
          reply.file('public/img/' + request.params.id + '-logo.png')
        },
        auth: false
      }
    }, {
      method: 'GET',
      path: '/svg/{file}',
      config: {
        handler: function (request, reply) {
          reply.file('public/svg/' + request.params.file + '.svg')
        },
        auth: false
      }
    }, {
      method: 'GET',
      path: '/fonts/{file}',
      config: {
        handler: function (request, reply) {
          reply.file('public/fonts/' + request.params.file)
        },
        auth: false
      }
    }, {
      method: 'GET',
      path: '/bower/{folder}/{file}',
      config: {
        handler: function (request, reply) {
          reply.file('bower_components/' + request.params.folder + '/' + request.params.file)
        },
        auth: false
      }
    }
  ]
}()
