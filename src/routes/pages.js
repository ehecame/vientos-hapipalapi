module.exports = function () {
    return [
        {
            method: 'GET',
            path: '/test',
            handler: function (request, reply) {
                reply.view('test');
            }
        }
    ];
}();