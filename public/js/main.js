$(document).ready(function () {
  setTopBarNavigationFunc()
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
