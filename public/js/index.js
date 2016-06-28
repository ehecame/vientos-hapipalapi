$(document).ready(function () {
  $('#map-row').click(function (event) {
    window.location.href = '/map'
  })
  $('.card').flip({trigger: 'manual', forceHeight: true})
  $('.benefit').on('mouseover', function (event) {
    console.log('over')
    console.log($(this))
    $(this).find('.card').flip(true)
  })
  $('.benefit').on('mouseout', function (event) {
    console.log('LEAVE')
    console.log($(this))
    $(this).find('.card').flip(false)
  })
})
