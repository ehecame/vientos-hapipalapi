$(document).ready(function () {
  $('.collaborationWay').click(collaborationWayClicked)
})

function collaborationWayClicked () {
  $('.collaborationWay .circle').removeClass('selected')
  $(this).find('.circle').addClass('selected')
  $('.subWays').hide()
  subClass = 'subWay_' + $(this).attr('id').split('_')[1]
  $('#' + subClass).show()
}
