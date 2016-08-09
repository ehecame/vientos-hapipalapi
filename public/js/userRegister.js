function onRegisterBtnClicked () {
  var form = $('#registerForm').serialize()
  console.log(form)
  $.post(
    '/api/user/register',
    form,
    function (data) {
      alert('Usuario registrado exitosamente')
    }
  )
}

// TODO onchange para email y username
// alertas para cuando ya están ocupados

// TODO verificar contraseña y comparar con confirmación

// TODO Ponerle captcha
