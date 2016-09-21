var SubscriberManager = require('./../../managers/subscriber');

function SubscriberController() { };
SubscriberController.prototype = (function () {
    return {
        insert: function insert(request, reply) {
            var db = request.mongo.db
            var newSubscriber = {email: request.payload.subsEmail}
            SubscriberManager.insert(db, newSubscriber, function (res) {
                reply('¡Listo!');
            })
        }
    }
})();
var SubscriberController = new SubscriberController();
module.exports = SubscriberController;
