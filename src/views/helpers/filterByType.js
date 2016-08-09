var _ = require('underscore')

var filterByType = function (list, type, options) {
  var filtered = _.filter(list, function (item) { return item.type == type })
  return filtered
}

module.exports = filterByType
