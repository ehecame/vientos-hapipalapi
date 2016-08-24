$(document).ready(function () {
  $('#newInterestInput').keyup(function (event) {
    if (event.keyCode == 13) {
      $('#addInterestBtn').click()
    }
  })
})

function login () {
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
