$(document).ready(function () {
  console.log('sí carguéeee!')
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
  $('#subsEmailInput').keyup(function (event) {
    if (event.keyCode == 13) {
      $('#subscribeBtn').click()
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

function subscribe() {
  if(validateEmail())
  $.post(
    '/api/subscribe',
    $('#subscribeForm').serialize(),
    function (data) {
      alert(data)
    }
  )
  else{
    alert("Escribe un email válido")
  }
  return false
}

function validateEmail(){
	var emailInput = $('#subsEmailInput')
	var email = emailInput.val()
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
