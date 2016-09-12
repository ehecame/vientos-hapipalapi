var _ = require('underscore')

var filterByType = function (list, type, options) {
	//console.log(type)
  var filtered = _.filter(list, function (item) { return item.type == type })
  //console.log(filtered)
  return filtered
}

module.exports = filterByType
