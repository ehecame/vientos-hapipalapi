$(document).ready(function () {
  console.log('sí carguéeee!')
  $('#newInterestInput').keyup(function (event) {
    if (event.keyCode == 13) {
      $('#addInterestBtn').click()
    }
  })
})

function login () {
  console.log($('#loginForm').serialize())
  $.post(
    '/api/user/login',
    $('#loginForm').serialize(),
    function (data) {
      console.log(data)
      if (data == 'success')
        window.location.href = $('#redirect').val()
    }
  )
}
