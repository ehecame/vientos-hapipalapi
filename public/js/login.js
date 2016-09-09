$(document).ready(function () {
  console.log('sí carguéeee!')
  $('#usernameInput').keyup(function (event) {
    if (event.keyCode == 13) {
      $('#passwordInput').focus()
    }
  })
  $('#passwordInput').keyup(function (event) {
    if (event.keyCode == 13) {
      $('#searchBtn').click()
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
      if (data == 'wrong password')
        alert('Contraseña incorrecta')
      if (data == 'wrong username')
        alert('Ese nombre de usuario no existe')
    }
  )
  return false
}
