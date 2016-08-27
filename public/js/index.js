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
})

function categoryIconClicked () {
  window.location.href = '/collaborate?cat=' + this.id
}
