$(document).ready(function () {
  $('#map-row').click(function (event) {
    window.location.href = '/collaborate'
  })
  $('.card').flip({trigger: 'manual', forceHeight: true})
  $('.benefit').on('mouseover', function (event) {
    $(this).find('.card').flip(true)
  })
  $('.benefit').on('mouseout', function (event) {
    $(this).find('.card').flip(false)
  })
  $('.category').click(categoryIconClicked)
  $('#imageAction').click(function(){
    window.location.href = '/collaborate'
  })
  $('#showMoreCatsBtn a').click(function(){
    $('#showMoreCatsBtn').addClass('hidden')
    $('.category').parent().removeClass('hidden')
    return false
  })
  $('#showMoreCollsBtn a').click(function(){
    $('#showMoreCollsBtn').addClass('hidden')
    $('.collaborationWay').parent().removeClass('hidden')
    return false
  })
})

function categoryIconClicked () {
  window.location.href = '/collaborate?cat=' + this.id
}
