$(document).ready(function () {
  $('.collaborationWay').click(collaborationWayClicked)
})

function collaborationWayClicked () {
  $('.collaborationWay .circle').removeClass('selected')
  $(this).find('.circle').addClass('selected')
}
