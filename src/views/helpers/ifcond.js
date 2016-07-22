var ifcond = function (v1, operator, v2, options) {
  console.log(operator)
  console.log(v1)
  console.log(v2)
  console.log(v1.indexOf(v2))
  switch (operator) {
    case '==':
      return (v1 == v2) ? options.fn(this) : options.inverse(this)
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this)
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this)
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this)
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this)
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this)
    case '&&':
      return (v1 && v2) ? options.fn(this) : options.inverse(this)
    case '||':
      return (v1 || v2) ? options.fn(this) : options.inverse(this)
    case 'contains':
      return (v1.indexOf(v2) != -1) ? options.fn(this) : options.inverse(this)
    default:
      return options.inverse(this)
  }
}

module.exports = ifcond
