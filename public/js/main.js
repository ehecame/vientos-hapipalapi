$(document).ready(function () {
  setTopBarNavigationFunc()
  console.log('')
  Handlebars.registerHelper('isSelected', function (variable, choiceToSelect) {
    return variable == choiceToSelect ? 'select' : ''
  })
  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
  }
})

function setTopBarNavigationFunc () {
  $('.navBarBtn a').click(function () {
    var anchor = this.href.split('#')[1]
    var offset = $('#' + anchor).offset().top
    $('html,body').animate({scrollTop: offset - 60}, 1000)
    return false
  })
  $('.navBarBtn').click(function (e) {
    var targetOffset = $($($(this).children()[0]).attr('href')).offset().top
    $('html,body').animate({scrollTop: targetOffset}, 1000)
  })
}

function setClosePopUpAction () {
  $('#registerPopUp').click(function () {$(this).find('.closePopUp')[0].click()})
  $('#loginPopUp').click(function () {$(this).find('.closePopUp')[0].click()})
}
