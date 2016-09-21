var SubscriberController = require('./../../controllers/api/subscriber.js')

module.exports = function () {
  return [
    {
      method: 'POST',
      path: '/api/subscribe',
      config: {
        handler: SubscriberController.insert,
        auth: false
      }
    },
  ]
}()
