$(document).ready(function () {
  $('#map-row').click(function (event) {
    window.location.href = '/map'
  })
  $('.card').flip({trigger: 'manual', forceHeight: true})
  $('.benefit').on('mouseover', function (event) {
    $(this).find('.card').flip(true)
  })
  $('.benefit').on('mouseout', function (event) {
    $(this).find('.card').flip(false)
  })
  $('.category').click(categoryIconClicked)
})

function categoryIconClicked () {
  window.location.href = '/map?cat=' + this.id
}
