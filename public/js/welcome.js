$(document).ready(function () {
  $('#usernameInput').keyup(function (event) {
    if (event.keyCode == 13) {
      $('#passwordInput').focus()
    }
  })
  $('#passwordInput').keyup(function (event) {
    if (event.keyCode == 13) {
      $('#loginBtn').click()
    }
  })
})

function loginw() {
  var data = $('#loginForm').serialize()
  $.post(
    '/api/user/login',
    data,
    function (data) {
      console.log(data)
      switch(data) {
        case 'success':
          window.location.href = "/"
          break;
        case 'wrong password':
          alert('Contraseña incorrecta')
          break;
        case 'wrong username':
          alert('Ese nombre de usuario no existe')
        default:
          window.location.href = "/project/"+data+"?conf=1"
      }
    }
  )
  return false
}
